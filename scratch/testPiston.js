const fetch = require('node-fetch'); // we'll use dynamic import for fetch if node < 18 or just native fetch
async function test() {
  const payload = {
    language: 'python',
    version: '3.10.0',
    files: [{ content: 'print(42)' }]
  };
  try {
    const res = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.text();
    console.log(res.status, data);
  } catch (e) {
    console.error(e);
  }
}
test();
