import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/hok_admin': {
        target: 'http://localhost:5174', // Assuming admin portal dev server runs on 5174
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hok_admin/, '')
      }
    }
  }
});
