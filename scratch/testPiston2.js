const fetch = require('node-fetch');
async function test() {
  const payload = {
    language: 'python',
    version: '3.10.0',
    files: [{ content: 'print(42)' }]
  };
  try {
    const res = await fetch('https://emacs.piston.rs/api/v2/execute', {
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
