// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import postcssTailwind from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development or production)
  const env = loadEnv(mode, process.cwd(), '');
  // Determine API base: dev uses VITE_API_URL, prod uses '' (same origin)
  const API_BASE = env.VITE_API_URL || '';

  return {
    define: {
      // Expose API_BASE to your client code as a global constant
      __API_BASE__: JSON.stringify(API_BASE)
    },
    plugins: [
      react(),
      svgr(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['index.html'],
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
          navigateFallback: '/index.html',
          runtimeCaching: [
            {
              // Match all same-origin API requests
              urlPattern: new RegExp(`^${API_BASE}/api/.*$`),
              handler: 'NetworkFirst',
              options: { cacheName: 'api-cache' }
            },
            {
              // Cache static assets
              urlPattern: /\/assets\/.*\.(js|css|png|svg)$/,
              handler: 'CacheFirst',
              options: { cacheName: 'asset-cache' }
            },
            {
              // Cache recipes-specific API endpoints
              urlPattern: new RegExp(`^${API_BASE}/api/recipes/.*$`),
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'recipes-api-cache',
                expiration: { maxEntries: 50, maxAgeSeconds: 86400 }
              }
            }
          ]
        }
      })
    ],
    css: {
      postcss: {
        plugins: [postcssTailwind(), autoprefixer()]
      }
    }
  };
});
