const fetch = require('node-fetch');
async function test() { 
  try {
    const res = await fetch('https://emacs.piston.rs/api/v2/runtimes');
    const data = await res.json();
    console.log(JSON.stringify(data.filter(r => r.language === 'java'), null, 2));
  } catch (e) {
    console.error(e);
  }
}
test();
