import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5173,
    open: true,
  },
  build: {
    rollupOptions: {
      input: {
        main:   resolve(__dirname, 'index.html'),
        person: resolve(__dirname, 'person.html'),
      },
    },
  },
});
