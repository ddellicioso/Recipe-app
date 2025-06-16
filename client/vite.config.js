// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import postcssTailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        // ❗️ Use the PostCSS plugin package, not the core tailwindcss module
        postcssTailwind(),
        autoprefixer(),
      ],
    },
  },
});
