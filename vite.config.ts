import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok-free.app', // Cho phép tất cả subdomain của ngrok-free.app
    ],
  },
  optimizeDeps: {
    include: ["react/jsx-runtime"],
  },
  resolve: {
    alias: [{ find: "src", replacement: "/src" }],
  },
});
