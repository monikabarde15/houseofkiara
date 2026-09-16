import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => ({
  // Keep all admin assets under this prefix in development too. The port-3000
  // reverse proxy forwards this prefix to the admin Vite server.
  base: '/hok_admin/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    port: 3001,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5003',
        changeOrigin: true,
        secure: false,
      },
    },
    // The admin is served through the port-3000 reverse proxy. Disable Vite's
    // separate websocket client to prevent failed HMR websocket errors in the
    // browser console; a normal browser refresh still loads all changes.
    hmr: false,
  },
}));
