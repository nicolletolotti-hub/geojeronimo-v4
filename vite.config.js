import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

import {
  PWA_BACKGROUND_COLOR,
  PWA_THEME_COLOR,
  runtimeCaching,
  workboxGlobPatterns,
} from './src/pwa/cacheConfig.js'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: [
        'favicon.svg',
        'pwa/icon.svg',
      ],
      manifest: {
        id: '/',
        name: 'GeoJeronimo — Operação territorial',
        short_name: 'GeoJeronimo',
        description:
          'Centro operacional para monitoramento hidrológico, ACS e Defesa Civil em São Jerônimo.',
        lang: 'pt-BR',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        theme_color: PWA_THEME_COLOR,
        background_color: PWA_BACKGROUND_COLOR,
        categories: ['navigation', 'utilities', 'productivity'],
        icons: [
          {
            src: '/pwa/icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: '/pwa/icon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'maskable',
          },
        ],
        screenshots: [],
      },
      workbox: {
        globPatterns: workboxGlobPatterns,
        globIgnores: ['**/inundacao/**/*.geojson'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        cleanupOutdatedCaches: true,
        navigateFallback: 'index.html',
        runtimeCaching,
      },
      devOptions: {
        enabled: true,
        type: 'module',
        navigateFallback: 'index.html',
      },
    }),
  ],
})
