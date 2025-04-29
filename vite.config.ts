
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { crx } from '@crxjs/vite-plugin';
import manifest from './public/manifest.json';
import { componentTagger } from "lovable-tagger";

// Create a properly typed manifest for crx plugin
const manifestV3 = {
  ...manifest,
};

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    crx({ manifest: manifestV3 }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: "::",
    port: 8080
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        background: path.resolve(__dirname, 'src/background.ts'),
      },
      output: {
        chunkFileNames: '[name]-[hash].js',
        entryFileNames: (chunkInfo) => {
          return chunkInfo.name === 'background' ? 'background.js' : '[name]-[hash].js';
        },
      },
    },
  },
}));
