import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import postcssTailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Savoré Recipes',
        short_name: 'Savoré',
        start_url: '/',
        display: 'standalone',
        background_color: '#394761',
        theme_color: '#394761',
        icons: [
          { src: 'savore-pwa-icon.png', sizes: '192x192', type: 'image/png' },
          { src: 'savore-pwa-icon.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/localhost:3001\/api\/.*$/,
            handler: 'NetworkFirst',
            options: { cacheName: 'api-cache' }
          },
          {
            urlPattern: /\/assets\/.*\.(js|css|png|svg)$/,
            handler: 'CacheFirst',
            options: { cacheName: 'asset-cache' }
          }
        ]
      }
    })
  ],
  css: {
    postcss: {
      plugins: [
        postcssTailwind(),
        autoprefixer()
      ]
    }
  }
});
