import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'

// Vite plugin for local code execution
const codeExecutorPlugin = () => ({
  name: 'code-executor-backend',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/api/execute' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const { code, language, stdin } = JSON.parse(body);
            
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

            const stdinPath = path.join(runDir, `stdin.txt`);
            fs.writeFileSync(stdinPath, stdin || '');

            let command = '';
            let exePath = '';

            if (language === 'python') {
              command = `python "${filePath}" < "${stdinPath}"`;
            } else if (language === 'javascript') {
              command = `node "${filePath}" < "${stdinPath}"`;
            } else if (language === 'cpp') {
              exePath = path.join(runDir, `solution.exe`);
              command = `g++ "${filePath}" -o "${exePath}" && "${exePath}" < "${stdinPath}"`;
            } else if (language === 'c') {
              exePath = path.join(runDir, `solution.exe`);
              command = `gcc "${filePath}" -o "${exePath}" && "${exePath}" < "${stdinPath}"`;
            } else if (language === 'java') {
              command = `javac "${filePath}" && java -cp "${runDir}" Main < "${stdinPath}"`;
            } else {
              try { fs.rmSync(runDir, { recursive: true, force: true }); } catch (cleanupErr) {}
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Unsupported language' }));
              return;
            }

            exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
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

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(output));
            });
          } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
          }
        });
      } else {
        next();
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), codeExecutorPlugin()],
})
