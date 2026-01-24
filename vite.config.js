// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),

    // PWA setting
    VitePWA({
      registerType: 'autoUpdate', // auto update after rebuilding
      injectRegister: 'auto', // auto inject service worker on index.html

      devOptions: {
        type: 'module',
        enabled: true // active PWA when using Dev mode
      },

      manifest: {
        name: 'راهنمای نمایشگاه', // name show in setting phone
        short_name: 'نمایشگاه', // name under application icon on phone
        description: 'اپلیکیشن راهنمای نمایشگاه',
        theme_color: '#1976d2', // top bar color
        background_color: '#ffffff',
        display: 'standalone', // without top bar browser
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable' // rounded icon on android
          }
        ]
      }
    })
  ],

  optimizeDeps: {
    //include: ["d3", "d3-cloud"],
  },

  server: {
    host: "0.0.0.0",
    port: 5000
  }
})