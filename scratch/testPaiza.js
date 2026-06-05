const https = require('https');

function makePost(url, payload) {
  return new Promise((resolve, reject) => {
    const dataString = JSON.stringify(payload);
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(dataString)
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
    req.write(dataString);
    req.end();
  });
}

function makeGet(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve(JSON.parse(body)));
    });
    req.on('error', reject);
  });
}

async function test() {
  try {
    const createRes = await makePost('https://api.paiza.io/runners/create', {
      source_code: 'print("Hello World")',
      language: 'python3',
      api_key: 'guest'
    });
    console.log('Create:', createRes);
    
    if (createRes.id) {
      setTimeout(async () => {
        const getRes = await makeGet(`https://api.paiza.io/runners/get_details?id=${createRes.id}&api_key=guest`);
        console.log('Details:', getRes);
      }, 2000);
    }
  } catch(e) {
    console.error(e);
  }
}
test();
