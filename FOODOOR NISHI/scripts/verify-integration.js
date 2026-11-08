// FOODOOR Full-Stack End-to-End Verification Test
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Find Python
function getPythonExe() {
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

const pythonExe = getPythonExe();
console.log('[TEST] Using Python executable:', pythonExe);

let pythonProc = null;
let nodeProc = null;

async function run() {
  console.log('[TEST] 1. Launching Python AI Microservice (:5001)...');
  pythonProc = spawn(pythonExe, [path.join(rootDir, 'ai_engine', 'server.py')], {
    cwd: rootDir,
    env: { ...process.env, PORT: '5001', AI_PORT: '5001', PYTHONUNBUFFERED: '1' }
  });

  pythonProc.stdout.on('data', d => console.log('  [AI STDOUT]', d.toString().trim()));
  pythonProc.stderr.on('data', d => console.error('  [AI STDERR]', d.toString().trim()));

  console.log('[TEST] 2. Launching Node.js Gateway & Web Host (:5000)...');
  nodeProc = spawn(process.execPath, [path.join(rootDir, 'server', 'server.js')], {
    cwd: rootDir,
    env: { ...process.env, PORT: '5000', AI_PORT: '5001', AI_SERVICE_URL: 'http://127.0.0.1:5001' }
  });

  nodeProc.stdout.on('data', d => console.log('  [NODE STDOUT]', d.toString().trim()));
  nodeProc.stderr.on('data', d => console.error('  [NODE STDERR]', d.toString().trim()));

  // Wait 3 seconds for both services to be ready
  await new Promise(r => setTimeout(r, 3000));

  const results = [];

  // Helper for test assertions
  async function testEndpoint(name, url, options = {}, validator) {
    try {
      const res = await fetch(url, options);
      const isJson = (res.headers.get('content-type') || '').includes('application/json');
      const data = isJson ? await res.json() : await res.text();
      const valid = validator(res, data);
      results.push({ name, passed: valid.pass, details: valid.details, status: res.status });
      console.log(`  ${valid.pass ? '✅' : '❌'} ${name} [HTTP ${res.status}]: ${valid.details}`);
    } catch (err) {
      results.push({ name, passed: false, details: err.message, status: 'CONN_ERR' });
      console.error(`  ❌ ${name} failed:`, err.message);
    }
  }

  console.log('\n[TEST] 3. Executing End-to-End API & Integration Checks:');

  // Test 1: Frontend SPA HTML
  await testEndpoint('Frontend SPA Delivery', 'http://127.0.0.1:5000/', {}, (res, data) => ({
    pass: res.status === 200 && typeof data === 'string' && data.includes('FOODOOR'),
    details: 'Returned HTTP 200 and contained FOODOOR app markup'
  }));

  // Test 2: System Health Check & AI Link
  await testEndpoint('System Health Check', 'http://127.0.0.1:5000/api/health', {}, (res, data) => ({
    pass: res.status === 200 && data.status === 'operational' && data.ai_microservice && data.ai_microservice.connected === true,
    details: `Status: ${data.status}, AI Connected: ${data.ai_microservice?.connected}`
  }));

  // Test 3: Menu Catalog & INR Currency
  await testEndpoint('Menu Catalog & INR', 'http://127.0.0.1:5000/api/food', {}, (res, data) => {
    const items = data.data || [];
    return {
      pass: res.status === 200 && Array.isArray(items) && items.length > 0 && typeof items[0].price === 'number',
      details: `Loaded ${items.length} dishes; Sample price: ₹${items[0]?.price}`
    };
  });

  // Test 4: AI Demand Forecast via Node Gateway -> Python AI
  await testEndpoint('AI Demand Forecast (Node -> Python)', 'http://127.0.0.1:5000/api/ai/forecast?weather=Clear', {}, (res, data) => ({
    pass: res.status === 200 && (data.peak_rush_hour !== undefined || data.total_predicted_orders_24h !== undefined),
    details: `Peak: ${data.peak_rush_hour?.time || 'N/A'}, 24h total: ${data.total_predicted_orders_24h || 0} orders`
  }));

  // Test 5: AI Recommendations
  await testEndpoint('AI Recommendations', 'http://127.0.0.1:5000/api/ai/recommendations', {}, (res, data) => ({
    pass: res.status === 200 && (data.ai_chefs_picks !== undefined || data.budget_meals !== undefined),
    details: `Featured: ${data.ai_chefs_picks?.length || 0} dishes, Combos: ${data.budget_meals?.length || 0}`
  }));

  // Test 6: AI Budget Meal Combos (under ₹299 / ₹349)
  await testEndpoint('AI Budget Combos', 'http://127.0.0.1:5000/api/ai/budget-meals?budget=350', {}, (res, data) => ({
    pass: res.status === 200 && Array.isArray(data.combos) && data.combos.length > 0,
    details: `Returned ${data.combos?.length || 0} budget combinations under ₹${data.budget || 350}`
  }));

  // Test 7: Authentication Login
  await testEndpoint('Auth Login (Demo Customer)', 'http://127.0.0.1:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'sarah.sharma@example.in', password: 'password123' })
  }, (res, data) => ({
    pass: res.status === 200 && data.token && data.user?.role === 'customer',
    details: `Authenticated as ${data.user?.full_name} (${data.user?.role})`
  }));

  // Teardown
  console.log('\n[TEST] 4. Tearing down test processes...');
  try { nodeProc.kill('SIGTERM'); } catch (e) {}
  try { pythonProc.kill('SIGTERM'); } catch (e) {}

  const allPassed = results.every(r => r.passed);
  console.log('\n============================================================');
  console.log(`  VERIFICATION RESULT: ${allPassed ? 'ALL TESTS PASSED (7/7) 🎉' : 'SOME TESTS FAILED ⚠️'}`);
  console.log('============================================================\n');

  process.exit(allPassed ? 0 : 1);
}

run().catch(err => {
  console.error('[TEST FATAL]', err);
  if (nodeProc) try { nodeProc.kill('SIGTERM'); } catch (e) {}
  if (pythonProc) try { pythonProc.kill('SIGTERM'); } catch (e) {}
  process.exit(1);
});
