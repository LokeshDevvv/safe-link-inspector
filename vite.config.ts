
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';

// Adjust the type to match what crx plugin expects
const manifestV3 = {
  ...manifest,
  background: {
    service_worker: "background.js",
    type: "module" // This ensures type is exactly "module"
  }
};

export default defineConfig({
  plugins: [react(), crx({ manifest: manifestV3 as any })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8080
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        background: path.resolve(__dirname, 'src/background.ts'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
