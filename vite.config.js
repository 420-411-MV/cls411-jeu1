// vite.config.js
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.jsx'),
      output: {
        entryFileNames: 'bundle.js',
        format: 'iife', // <-- clé !
        name: 'ReceiverApp', // global var pour l'IIFE
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  }
})