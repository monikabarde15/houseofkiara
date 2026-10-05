import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
    strictPort: false,
    proxy: {
      "/api": {
        target: "http://localhost:5003",
        changeOrigin: true,
      },
      "/hok_admin": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
