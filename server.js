import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import crypto from 'crypto';
import https from 'https';

// Native HTTPS POST helper to avoid 'fetch is not defined' on older Node versions
function makeJsonPostRequest(url, payload, customHeaders = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const dataString = JSON.stringify(payload);
    
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString),
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ...customHeaders
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => { responseBody += chunk; });
      res.on('end', () => {
        try {
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data: JSON.parse(responseBody) });
        } catch (e) {
          resolve({ ok: res.statusCode >= 200 && res.statusCode < 300, status: res.statusCode, data: null });
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(dataString);
    req.end();
  });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nqtmcq';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── AUTHENTICATION HELPERS (NATIVE CRYPTO HS256 JWT) ─────────────────────────
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'nqt-salt-key').digest('hex');
}

function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const secret = process.env.JWT_SECRET || 'nqt-secret-token-key-12345';
  const signature = crypto.createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');
  return `${header}.${body}.${signature}`;
}

function verifyToken(token) {
  try {
    const [header, body, signature] = token.split('.');
    const secret = process.env.JWT_SECRET || 'nqt-secret-token-key-12345';
    const expectedSignature = crypto.createHmac('sha256', secret)
      .update(`${header}.${body}`)
      .digest('base64url');
    if (signature !== expectedSignature) return null;
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch (e) {
    return null;
  }
}

// ─── MongoDB Schemas & Models ────────────────────────────────────────────────
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
);
const User = mongoose.model('User', UserSchema);

const StorageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    key:    { type: String, required: true, index: true },
    value:  { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);
// Ensure uniqueness per user and key
StorageSchema.index({ userId: 1, key: 1 }, { unique: true });
const Storage = mongoose.model('Storage', StorageSchema);

// ─── Connect to MongoDB ──────────────────────────────────────────────────────
let dbConnected = false;

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });
    dbConnected = true;
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.warn('⚠️  Falling back to local db.json file for storage.');
    dbConnected = false;
  }
}

// ─── JSON File fallback helpers (if Mongo is down) ─────────────────────────
const DB_FILE = path.join(process.cwd(), 'db.json');

function readDbFile() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8').trim();
      if (!data) return {};
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to read db.json:', e);
  }
  return {};
}

function writeDbFile(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write db.json:', e);
  }
}

// Local fallback user-scoped helpers
function fallbackRegister(username, password) {
  const db = readDbFile();
  if (!db._users) db._users = [];
  const normalized = username.toLowerCase().trim();
  if (db._users.some(u => u.username === normalized)) {
    throw new Error('Username already exists');
  }
  const userId = `local_user_${Date.now()}`;
  const newUser = { id: userId, username: normalized, password: hashPassword(password) };
  db._users.push(newUser);
  writeDbFile(db);
  return newUser;
}

function fallbackLogin(username, password) {
  const db = readDbFile();
  if (!db._users) return null;
  const normalized = username.toLowerCase().trim();
  const user = db._users.find(u => u.username === normalized);
  if (!user) return null;
  if (user.password !== hashPassword(password)) return null;
  return user;
}

function fallbackGet(userId, key) {
  const db = readDbFile();
  const compositeKey = `_storage_${userId}_${key}`;
  return db[compositeKey] !== undefined ? db[compositeKey] : null;
}

function fallbackSet(userId, key, value) {
  const db = readDbFile();
  const compositeKey = `_storage_${userId}_${key}`;
  db[compositeKey] = value;
  writeDbFile(db);
}

function fallbackDelete(userId, key) {
  const db = readDbFile();
  const compositeKey = `_storage_${userId}_${key}`;
  delete db[compositeKey];
  writeDbFile(db);
}

// ─── AUTHENTICATION MIDDLEWARE ───────────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
    req.userId = decoded.userId;
    req.username = decoded.username;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: ' + err.message });
  }
};

// ─── 1. AUTHENTICATION ENDPOINTS ──────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, geminiApiKey } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const normalizedUsername = username.toLowerCase().trim();
    if (normalizedUsername.length < 3) {
      return res.status(400).json({ error: 'Username must be at least 3 characters long' });
    }
    if (password.length < 4) {
      return res.status(400).json({ error: 'Password must be at least 4 characters long' });
    }

    let user;
    if (dbConnected) {
      const existing = await User.findOne({ username: normalizedUsername });
      if (existing) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      user = new User({ username: normalizedUsername, password: hashPassword(password) });
      await user.save();
    } else {
      try {
        const localUser = fallbackRegister(normalizedUsername, password);
        user = { _id: localUser.id, username: localUser.username };
      } catch (err) {
        return res.status(400).json({ error: err.message });
      }
    }

    const userId = user._id.toString();
    const token = generateToken({ userId, username: normalizedUsername });

    // Store Gemini API key once in storage if provided
    if (geminiApiKey && geminiApiKey.trim()) {
      if (dbConnected) {
        await Storage.findOneAndUpdate(
          { userId, key: 'gemini_api_key' },
          { userId, key: 'gemini_api_key', value: geminiApiKey.trim() },
          { upsert: true }
        );
      } else {
        fallbackSet(userId, 'gemini_api_key', geminiApiKey.trim());
      }
    }

    res.json({ success: true, token, user: { id: userId, username: normalizedUsername } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    const normalizedUsername = username.toLowerCase().trim();

    let userId;
    if (dbConnected) {
      const user = await User.findOne({ username: normalizedUsername });
      if (!user || user.password !== hashPassword(password)) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }
      userId = user._id.toString();
    } else {
      const localUser = fallbackLogin(normalizedUsername, password);
      if (!localUser) {
        return res.status(400).json({ error: 'Invalid username or password' });
      }
      userId = localUser.id;
    }

    const token = generateToken({ userId, username: normalizedUsername });
    res.json({ success: true, token, user: { id: userId, username: normalizedUsername } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  res.json({ user: { id: req.userId, username: req.username } });
});

// ─── 2. STORAGE API ENDPOINTS (USER-SCOPED) ──────────────────────────────────
app.get('/api/storage/:key', authMiddleware, async (req, res) => {
  try {
    const { key } = req.params;
    const userId = req.userId;
    
    let value;
    if (dbConnected) {
      const doc = await Storage.findOne({ userId, key });
      value = doc ? doc.value : null;
    } else {
      value = fallbackGet(userId, key);
    }
    res.json({ key, value: value !== undefined ? value : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/storage/:key', authMiddleware, async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    const userId = req.userId;

    if (dbConnected) {
      await Storage.findOneAndUpdate(
        { userId, key },
        { userId, key, value },
        { upsert: true, new: true }
      );
    } else {
      fallbackSet(userId, key, value);
    }
    res.json({ success: true, key, value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/storage/:key', authMiddleware, async (req, res) => {
  try {
    const { key } = req.params;
    const userId = req.userId;
    
    if (dbConnected) {
      await Storage.deleteOne({ userId, key });
    } else {
      fallbackDelete(userId, key);
    }
    res.json({ success: true, key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/storage/migrate', authMiddleware, async (req, res) => {
  try {
    const migrationData = req.body;
    const userId = req.userId;
    let migratedCount = 0;

    for (const [key, value] of Object.entries(migrationData)) {
      if (value !== undefined && value !== null) {
        if (dbConnected) {
          await Storage.findOneAndUpdate(
            { userId, key },
            { userId, key, value },
            { upsert: true }
          );
        } else {
          fallbackSet(userId, key, value);
        }
        migratedCount++;
      }
    }
    res.json({ success: true, migratedCount });
  } catch (err) {
    res.status(500).json({ error: 'Migration failed: ' + err.message });
  }
});

// ─── 3. DB Health Check Endpoint ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: dbConnected ? 'mongodb' : 'json-fallback',
    timestamp: new Date().toISOString()
  });
});

// ─── 4. Code Execution API Endpoint (SECURED WITH AUTH) ──────────────────────
app.post('/api/execute', authMiddleware, async (req, res) => {
  try {
    const { code, language, stdin } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    // Map frontend language names
    const languageKeys = {
      python: { piston: 'python', pistonVersion: '3.10.0', onecompiler: 'python', onlineio: 'python-3.11', jdoodle: 'python3', jdoodleVer: '3' },
      cpp: { piston: 'c++', pistonVersion: '10.2.0', onecompiler: 'cpp', onlineio: 'cpp-11', jdoodle: 'cpp', jdoodleVer: '5' },
      c: { piston: 'c', pistonVersion: '10.2.0', onecompiler: 'c', onlineio: 'c-11', jdoodle: 'c', jdoodleVer: '5' },
      java: { piston: 'java', pistonVersion: '15.0.2', onecompiler: 'java', onlineio: 'java-17', jdoodle: 'java', jdoodleVer: '4' },
      javascript: { piston: 'javascript', pistonVersion: '18.15.0', onecompiler: 'nodejs', onlineio: 'nodejs-18', jdoodle: 'nodejs', jdoodleVer: '4' }
    };

    const langConfig = languageKeys[language];
    if (!langConfig) {
      return res.status(400).json({ error: 'Unsupported language' });
    }

    const fileName = language === 'java' ? 'Main.java' : `main.${language === 'python' ? 'py' : language === 'javascript' ? 'js' : language}`;

    let data = null;
    let compileErr = '';
    let runErr = '';
    let runOut = '';
    let runCode = 1;

    // --- Provider 1: OnlineCompiler.io (Requires ONLINECOMPILER_API_KEY in .env) ---
    if (!data && process.env.ONLINECOMPILER_API_KEY) {
      try {
        const payload = { compiler: langConfig.onlineio, code: code, input: stdin || '' };
        const response = await makeJsonPostRequest('https://api.onlinecompiler.io/api/run-code-sync/', payload, {
          'Authorization': process.env.ONLINECOMPILER_API_KEY
        });
        if (response.ok && response.data) {
          data = response.data;
          runOut = data.stdout || '';
          runErr = data.stderr || '';
          runCode = data.exit_code || 0;
        }
      } catch (e) { console.warn("OnlineCompiler.io failed:", e.message); }
    }

    // --- Provider 2: JDoodle (Requires JDOODLE_CLIENT_ID and JDOODLE_CLIENT_SECRET in .env) ---
    if (!data && process.env.JDOODLE_CLIENT_ID && process.env.JDOODLE_CLIENT_SECRET) {
      try {
        const payload = {
          clientId: process.env.JDOODLE_CLIENT_ID,
          clientSecret: process.env.JDOODLE_CLIENT_SECRET,
          script: code,
          language: langConfig.jdoodle,
          versionIndex: langConfig.jdoodleVer,
          stdin: stdin || ''
        };
        const response = await makeJsonPostRequest('https://api.jdoodle.com/v1/execute', payload);
        if (response.ok && response.data && !response.data.error) {
          data = response.data;
          runOut = data.output || '';
          runCode = data.statusCode === 200 ? 0 : 1;
        }
      } catch (e) { console.warn("JDoodle failed:", e.message); }
    }

    // --- Provider 3: OneCompiler (Public API fallback) ---
    if (!data) {
      try {
        const ocPayload = {
          language: langConfig.onecompiler,
          stdin: stdin || '',
          files: [{ name: fileName, content: code }]
        };
        const ocResponse = await makeJsonPostRequest('https://onecompiler.com/api/code/exec', ocPayload);
        if (ocResponse.ok && ocResponse.data && !ocResponse.data.error) {
          data = ocResponse.data;
          compileErr = data.exception || '';
          runErr = data.stderr || '';
          runOut = data.stdout || '';
          runCode = (compileErr || runErr || data.status !== 'success') ? 1 : 0;
        }
      } catch (e) { console.warn("OneCompiler API failed:", e.message); }
    }

    // --- Provider 4: Piston API Mirrors ---
    if (!data) {
      const pistonPayload = {
        language: langConfig.piston,
        version: langConfig.pistonVersion,
        files: [{ name: fileName, content: code }],
        stdin: stdin || ''
      };

      const pistonUrls = [
        'https://piston.pterodactyl.io/api/v2/execute',
        'https://emacs.piston.rs/api/v2/execute',
        'https://emkc.org/api/v2/piston/execute'
      ];

      for (const url of pistonUrls) {
        try {
          const fetchResponse = await makeJsonPostRequest(url, pistonPayload);
          
          if (fetchResponse.ok && fetchResponse.data) {
            const tempData = fetchResponse.data;
            const cErr = tempData.compile ? tempData.compile.stderr : '';
            if (cErr && cErr.includes('not found') && cErr.includes('javac')) continue;
            
            data = tempData;
            compileErr = tempData.compile && tempData.compile.code !== 0 ? tempData.compile.stderr : '';
            runErr = tempData.run ? tempData.run.stderr : '';
            runOut = tempData.run ? tempData.run.stdout : '';
            runCode = tempData.run ? tempData.run.code : (tempData.compile ? tempData.compile.code : 1);
            break; 
          }
        } catch (err) { console.warn(`Piston API failed for ${url}:`, err.message); }
      }
    }

    if (!data) {
      return res.status(500).json({ error: 'All online compilers (OnlineCompiler.io, JDoodle, OneCompiler, & Piston) are currently unavailable or rate limited. Please ensure API keys are set in .env or try again later.' });
    }
    
    // Combine outputs
    const fullOutput = (compileErr ? compileErr + '\n' : '') + runOut + (runErr ? '\n' + runErr : '');

    // Return the formatted output to the frontend
    res.json({
      code: runCode,
      stdout: runOut,
      stderr: compileErr || runErr,
      output: fullOutput.trim()
    });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── 5. Serve Static Files (Production) ──────────────────────────────────────
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ─── Start Server ─────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`📦 Storage: ${dbConnected ? 'MongoDB Atlas' : 'Local db.json'}`);
  });
});
