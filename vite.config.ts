import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        typescript: resolve(import.meta.dirname, 'index.html'),
        react: resolve(import.meta.dirname, 'react.html'),
        vue: resolve(import.meta.dirname, 'vue.html'),
        angular: resolve(import.meta.dirname, 'angular.html'),
        webComponents: resolve(import.meta.dirname, 'web-components.html'),
      },
    },
  },
});
