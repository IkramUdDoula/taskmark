import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'TaskMark',
        short_name: 'TaskMark',
        description: 'Offline Notes App',
        theme_color: '#111827',
        background_color: '#1A3636',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        screenshots: [
          {
            src: '/icons/splash-640x1136.png',
            sizes: '640x1136',
            type: 'image/png'
          },
          {
            src: '/icons/splash-750x1334.png',
            sizes: '750x1334',
            type: 'image/png'
          },
          {
            src: '/icons/splash-1242x2208.png',
            sizes: '1242x2208',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  }
});
