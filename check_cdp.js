const http = require('http');

function cdpRequest(sessionId, method, params = {}) {
  return new Promise((resolve, reject) => {
    const WebSocket = require('ws');
    reject(new Error('ws not available'));
  });
}

// Use HTTP-based CDP to get pages and use fetch-based approach
async function getPages() {
  return new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

async function main() {
  try {
    const pages = await getPages();
    console.log('Available pages:');
    pages.forEach((p, i) => {
      console.log(`  ${i}: ${p.title} - ${p.url}`);
      console.log(`     WS: ${p.webSocketDebuggerUrl}`);
    });
  } catch (err) {
    console.error('Could not connect to Chrome DevTools:', err.message);
    console.log('\nChrome may not be running with --remote-debugging-port=9222');
  }
}

main();
