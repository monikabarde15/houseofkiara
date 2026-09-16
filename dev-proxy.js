// dev-proxy.js – reverse proxy exposing both front‑end and admin on port 3000
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 3000;

const apiProxyError = (err, req, res) => {
  console.error(`[HPM] API proxy error for ${req.method} ${req.url}: ${err.code || err.message}`);
  if (res.headersSent) return;
  res.writeHead(503, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    success: false,
    message: 'Admin API is starting up. Please try signing in again in a moment.',
  }));
};

// Proxy API requests directly to the backend
app.use('/api', createProxyMiddleware({
  target: 'http://127.0.0.1:5003',
  changeOrigin: true,
  secure: false,
  timeout: 60000,
  proxyTimeout: 60000,
  onError: apiProxyError,
}));

// The admin Vite app uses /hok_admin/ as its base, so preserve the prefix.
app.use('/hok_admin', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  ws: true,
}));

// Everything else (public front‑end) goes to the front‑end dev server (port 3005)
app.use('/', createProxyMiddleware({
  target: 'http://localhost:3005',
  changeOrigin: true,
}));

const server = app.listen(PORT);

server.on('listening', () => {
  console.log(`🚀 Proxy running → http://localhost:${PORT}`);
});

server.on('error', (error) => {
  console.error(`Unable to start the port-${PORT} proxy: ${error.message}`);
  process.exitCode = 1;
});
