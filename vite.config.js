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

            const fileExtensions = {
              python: 'py',
              cpp: 'cpp',
              c: 'c',
              java: 'Main.java',
              javascript: 'js'
            };

            const ext = fileExtensions[language] || 'txt';
            const baseName = `temp_${Date.now()}`;
            const fileName = language === 'java' ? 'Main.java' : `${baseName}.${ext}`;
            const filePath = path.join(tempDir, fileName);

            fs.writeFileSync(filePath, code);

            const stdinPath = path.join(tempDir, `${baseName}_stdin.txt`);
            fs.writeFileSync(stdinPath, stdin || '');

            let command = '';
            let exePath = '';

            if (language === 'python') {
              command = `python "${filePath}" < "${stdinPath}"`;
            } else if (language === 'javascript') {
              command = `node "${filePath}" < "${stdinPath}"`;
            } else if (language === 'cpp') {
              exePath = path.join(tempDir, `${baseName}.exe`);
              command = `g++ "${filePath}" -o "${exePath}" && "${exePath}" < "${stdinPath}"`;
            } else if (language === 'c') {
              exePath = path.join(tempDir, `${baseName}.exe`);
              command = `gcc "${filePath}" -o "${exePath}" && "${exePath}" < "${stdinPath}"`;
            } else if (language === 'java') {
              command = `javac "${filePath}" && java -cp "${tempDir}" Main < "${stdinPath}"`;
            } else {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Unsupported language' }));
              return;
            }

            exec(command, { timeout: 5000 }, (error, stdout, stderr) => {
              // Clean up files
              try {
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
                if (fs.existsSync(stdinPath)) fs.unlinkSync(stdinPath);
                if (exePath && fs.existsSync(exePath)) fs.unlinkSync(exePath);
                if (language === 'java') {
                  const classFile = path.join(tempDir, 'Main.class');
                  if (fs.existsSync(classFile)) fs.unlinkSync(classFile);
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
