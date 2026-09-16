const http = require('http');

http.get('http://localhost:3000/api/products', (res) => {
  console.log(`[proxy] Status: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(`[proxy] Body: ${data}`));
}).on('error', err => {
  console.error(`[proxy] Error: ${err.message}`);
});
