import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = process.env.DB_PATH || path.join(process.cwd(), 'db.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Helper to read database
function readDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to read database file, returning empty object:', e);
  }
  return {};
}

// Helper to write database
function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (e) {
    console.error('Failed to write database file:', e);
  }
}

// 1. Storage API Endpoints
app.get('/api/storage/:key', (req, res) => {
  const db = readDb();
  const { key } = req.params;
  const value = db[key];
  res.json({ key, value: value !== undefined ? value : null });
});

app.post('/api/storage/:key', (req, res) => {
  const db = readDb();
  const { key } = req.params;
  const { value } = req.body;
  db[key] = value;
  writeDb(db);
  res.json({ success: true, key, value });
});

app.delete('/api/storage/:key', (req, res) => {
  const db = readDb();
  const { key } = req.params;
  delete db[key];
  writeDb(db);
  res.json({ success: true, key });
});

app.post('/api/storage/migrate', (req, res) => {
  try {
    const db = readDb();
    const migrationData = req.body;
    let migratedCount = 0;
    
    for (const [key, value] of Object.entries(migrationData)) {
      if (value !== undefined && value !== null) {
        db[key] = value;
        migratedCount++;
      }
    }
    
    if (migratedCount > 0) {
      writeDb(db);
    }
    
    res.json({ success: true, migratedCount });
  } catch (err) {
    res.status(500).json({ error: 'Migration failed: ' + err.message });
  }
});

// 2. Code Execution API Endpoint (Migrated from vite.config.js)
app.post('/api/execute', (req, res) => {
  try {
    const { code, language, stdin } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'No code provided' });
    }

    const tempDir = path.join(process.cwd(), 'temp_exec');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    // Generate unique subdirectory for this specific run request
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
      // Clean up run directory completely
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

// Serve static files from the Vite build directory in production
const distPath = path.join(process.cwd(), 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // Wildcard route to serve index.html for React Router / SPA fallback
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});
