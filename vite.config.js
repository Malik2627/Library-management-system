import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-404-html',
      closeBundle() {
        const indexPath = path.resolve(__dirname, 'dist', 'index.html');
        const notFoundPath = path.resolve(__dirname, 'dist', '404.html');
        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, notFoundPath);
        }
      }
    }
  ],
  base: '/Library-management-system/',
  server: {
    port: 5173,
    host: true
  }
});
