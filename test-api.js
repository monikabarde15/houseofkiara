const http = require('http');

http.get('http://127.0.0.1:5003/api/products', (res) => {
  console.log(`Status: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(`Body: ${data.substring(0, 200)}`));
}).on('error', err => {
  console.error(`Error: ${err.message}`);
});

http.get('http://localhost:5003/api/products', (res) => {
  console.log(`[localhost] Status: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(`[localhost] Body: ${data.substring(0, 200)}`));
}).on('error', err => {
  console.error(`[localhost] Error: ${err.message}`);
});
