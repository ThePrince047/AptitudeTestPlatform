import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nqtmcq';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ─── MongoDB Schema & Model ─────────────────────────────────────────────────
const StorageSchema = new mongoose.Schema(
  {
    key:   { type: String, required: true, unique: true, index: true },
    value: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);
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
    await migrateFromJsonFile();
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.warn('⚠️  Falling back to local db.json file for storage.');
    dbConnected = false;
  }
}

// ─── One-time migration from db.json ────────────────────────────────────────
async function migrateFromJsonFile() {
  const DB_FILE = path.join(process.cwd(), 'db.json');
  if (!fs.existsSync(DB_FILE)) return;

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8').trim();
    if (!raw || raw === '{}' || raw === '') return;

    const data = JSON.parse(raw);
    const keys = Object.keys(data);
    if (keys.length === 0) return;

    // Only migrate if MongoDB is empty
    const count = await Storage.countDocuments();
    if (count > 0) {
      console.log('ℹ️  MongoDB already has data, skipping db.json migration.');
      return;
    }

    let migrated = 0;
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        await Storage.findOneAndUpdate(
          { key },
          { key, value },
          { upsert: true, new: true }
        );
        migrated++;
      }
    }
    console.log(`✅ Migrated ${migrated} keys from db.json to MongoDB.`);
    // Rename old file so we don't migrate again
    fs.renameSync(DB_FILE, DB_FILE + '.migrated');
  } catch (e) {
    console.error('Migration error:', e.message);
  }
}

// ─── JSON File fallback helpers (if Mongo is down) ─────────────────────────
const DB_FILE = path.join(process.cwd(), 'db.json');

function readDbFile() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
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

// ─── Storage Helpers (MongoDB primary, JSON fallback) ───────────────────────
async function storageGet(key) {
  if (dbConnected) {
    const doc = await Storage.findOne({ key });
    return doc ? doc.value : null;
  }
  const db = readDbFile();
  return db[key] !== undefined ? db[key] : null;
}

async function storageSet(key, value) {
  if (dbConnected) {
    await Storage.findOneAndUpdate(
      { key },
      { key, value },
      { upsert: true, new: true }
    );
    return;
  }
  const db = readDbFile();
  db[key] = value;
  writeDbFile(db);
}

async function storageDelete(key) {
  if (dbConnected) {
    await Storage.deleteOne({ key });
    return;
  }
  const db = readDbFile();
  delete db[key];
  writeDbFile(db);
}

// ─── 1. Storage API Endpoints ────────────────────────────────────────────────
app.get('/api/storage/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const value = await storageGet(key);
    res.json({ key, value: value !== undefined ? value : null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/storage/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    await storageSet(key, value);
    res.json({ success: true, key, value });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/storage/:key', async (req, res) => {
  try {
    const { key } = req.params;
    await storageDelete(key);
    res.json({ success: true, key });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/storage/migrate', async (req, res) => {
  try {
    const migrationData = req.body;
    let migratedCount = 0;

    for (const [key, value] of Object.entries(migrationData)) {
      if (value !== undefined && value !== null) {
        await storageSet(key, value);
        migratedCount++;
      }
    }

    res.json({ success: true, migratedCount });
  } catch (err) {
    res.status(500).json({ error: 'Migration failed: ' + err.message });
  }
});

// ─── 2. DB Health Check Endpoint ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    db: dbConnected ? 'mongodb' : 'json-fallback',
    timestamp: new Date().toISOString()
  });
});

// ─── 3. Code Execution API Endpoint ──────────────────────────────────────────
app.post('/api/execute', (req, res) => {
  try {
    const { code, language, stdin } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    const tempDir = path.join(process.cwd(), 'temp_exec');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const runDir = path.join(tempDir, runId);
    fs.mkdirSync(runDir, { recursive: true });

    const fileExtensions = {
      python: 'py',
      cpp: 'cpp',
      c: 'c',
      java: 'Main.java',
      javascript: 'js'
    };

    const ext = fileExtensions[language] || 'txt';
    const fileName = language === 'java' ? 'Main.java' : `solution.${ext}`;
    const filePath = path.join(runDir, fileName);

    fs.writeFileSync(filePath, code);

    const stdinPath = path.join(runDir, 'stdin.txt');
    fs.writeFileSync(stdinPath, stdin || '');

    let command = '';
    let exePath = '';

    if (language === 'python') {
      command = `python "${filePath}" < "${stdinPath}"`;
    } else if (language === 'javascript') {
      command = `node "${filePath}" < "${stdinPath}"`;
    } else if (language === 'cpp') {
      exePath = path.join(runDir, 'solution.exe');
      command = `g++ "${filePath}" -o "${exePath}" && "${exePath}" < "${stdinPath}"`;
    } else if (language === 'c') {
      exePath = path.join(runDir, 'solution.exe');
      command = `gcc "${filePath}" -o "${exePath}" && "${exePath}" < "${stdinPath}"`;
    } else if (language === 'java') {
      command = `javac "${filePath}" && java -cp "${runDir}" Main < "${stdinPath}"`;
    } else {
      try { fs.rmSync(runDir, { recursive: true, force: true }); } catch (cleanupErr) {}
      return res.status(400).json({ error: 'Unsupported language' });
    }

    exec(command, { timeout: 8000 }, (error, stdout, stderr) => {
      try {
        if (fs.existsSync(runDir)) {
          fs.rmSync(runDir, { recursive: true, force: true });
        }
      } catch (cleanupErr) {
        console.error('Cleanup error:', cleanupErr);
      }

      const output = {
        code: error ? error.code || 1 : 0,
        stdout: stdout || '',
        stderr: stderr || (error ? error.message : ''),
        output: (stdout || '') + (stderr || '')
      };

      res.json(output);
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── 4. Serve Static Files (Production) ──────────────────────────────────────
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
