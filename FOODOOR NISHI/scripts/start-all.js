import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Load environment variables from .env if present
const envPath = path.join(rootDir, '.env');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.substring(0, idx).trim();
        const val = trimmed.substring(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  });
}

// Locate Python executable
function getPythonExecutable() {
  if (process.env.PYTHON_PATH) {
    const resolvedCustom = path.isAbsolute(process.env.PYTHON_PATH)
      ? process.env.PYTHON_PATH
      : path.resolve(rootDir, process.env.PYTHON_PATH);
    if (fs.existsSync(resolvedCustom)) return resolvedCustom;
  }
  const winVenv = path.join(rootDir, '.venv', 'Scripts', 'python.exe');
  if (fs.existsSync(winVenv)) return winVenv;
  const nixVenv = path.join(rootDir, '.venv', 'bin', 'python');
  if (fs.existsSync(nixVenv)) return nixVenv;
  return process.platform === 'win32' ? 'python' : 'python3';
}

const pythonExe = getPythonExecutable();
const nodePort = process.env.PORT || 5000;
const aiPort = process.env.AI_PORT || 5001;

console.log('\n============================================================');
console.log('  FOODOOR – Unified Full-Stack Application Launcher');
console.log('============================================================');
console.log(`  [Config] Node Backend Port   : ${nodePort}`);
console.log(`  [Config] Python AI Port      : ${aiPort}`);
console.log(`  [Config] Python Interpreter  : ${pythonExe}`);
console.log('============================================================\n');

let pythonProcess = null;
let nodeProcess = null;

function shutdown() {
  console.log('\n[FOODOOR] Gracefully shutting down services...');
  if (nodeProcess) {
    try { nodeProcess.kill('SIGTERM'); } catch (e) {}
  }
  if (pythonProcess) {
    try { pythonProcess.kill('SIGTERM'); } catch (e) {}
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// 1. Start Python AI Microservice
console.log('[1/2] Starting Python AI Microservice on port ' + aiPort + '...');
const aiEnv = { ...process.env, PORT: String(aiPort), AI_PORT: String(aiPort), PYTHONUNBUFFERED: '1' };

pythonProcess = spawn(pythonExe, [path.join(rootDir, 'ai_engine', 'server.py')], {
  cwd: rootDir,
  env: aiEnv,
  stdio: ['ignore', 'pipe', 'pipe']
});

pythonProcess.stdout.on('data', data => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(l => {
    if (l) console.log(`\x1b[35m[AI Engine :${aiPort}]\x1b[0m ${l}`);
  });
});

pythonProcess.stderr.on('data', data => {
  const lines = data.toString().trim().split('\n');
  lines.forEach(l => {
    if (l) console.error(`\x1b[31m[AI Engine ERR]\x1b[0m ${l}`);
  });
});

pythonProcess.on('exit', code => {
  if (code !== null && code !== 0) {
    console.warn(`[AI Engine] Exited with code ${code}. Node backend will use built-in heuristic fallbacks.`);
  }
});

// Wait briefly for Python microservice to initialize, then start Node.js backend
setTimeout(() => {
  console.log('\n[2/2] Starting Node.js Backend & Static Web Host on port ' + nodePort + '...');
  const nodeEnv = {
    ...process.env,
    PORT: String(nodePort),
    AI_PORT: String(aiPort),
    AI_SERVICE_URL: process.env.AI_SERVICE_URL || `http://localhost:${aiPort}`
  };

  nodeProcess = spawn(process.execPath, [path.join(rootDir, 'server', 'server.js')], {
    cwd: rootDir,
    env: nodeEnv,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  nodeProcess.stdout.on('data', data => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(l => {
      if (l) console.log(`\x1b[32m[Node Web :${nodePort}]\x1b[0m ${l}`);
    });
  });

  nodeProcess.stderr.on('data', data => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(l => {
      if (l) console.error(`\x1b[31m[Node Web ERR]\x1b[0m ${l}`);
    });
  });

  nodeProcess.on('exit', code => {
    console.log(`[Node Web] Exited with code ${code}`);
    shutdown();
  });
}, 1200);

