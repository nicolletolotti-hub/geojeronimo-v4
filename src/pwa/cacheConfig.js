/**
 * Regras de cache Workbox — shell offline + dados territoriais sob demanda.
 * APIs dinâmicas (Supabase, DCRS) permanecem NetworkOnly.
 */

export const PWA_THEME_COLOR = '#090e18'
export const PWA_BACKGROUND_COLOR = '#090e18'

export const workboxGlobPatterns = [
  '**/*.{js,css,html,svg,png,ico,woff2,webmanifest}',
]

/** @type {import('workbox-build').RuntimeCaching[]}
 */
export const runtimeCaching = [
  {
    urlPattern: ({ request }) => request.mode === 'navigate',
    handler: 'NetworkFirst',
    options: {
      cacheName: 'geojeronimo-pages',
      networkTimeoutSeconds: 4,
      expiration: { maxEntries: 8, maxAgeSeconds: 86400 },
    },
  },
  {
    urlPattern: /\/inundacao\/.*\.geojson$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'geojeronimo-flood',
      expiration: { maxEntries: 12, maxAgeSeconds: 604800 },
      cacheableResponse: { statuses: [0, 200] },
    },
  },
  {
    urlPattern: /\/ruas\/.*\.geojson$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'geojeronimo-ruas',
      expiration: { maxEntries: 4, maxAgeSeconds: 604800 },
      cacheableResponse: { statuses: [0, 200] },
    },
  },
  {
    urlPattern: /\/limites\/.*\.geojson$/i,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'geojeronimo-limites',
      expiration: { maxEntries: 4, maxAgeSeconds: 604800 },
      cacheableResponse: { statuses: [0, 200] },
    },
  },
  {
    urlPattern:
      /^https:\/\/.*\.tile\.openstreetmap\.org\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'geojeronimo-osm-tiles',
      expiration: { maxEntries: 180, maxAgeSeconds: 86400 },
      cacheableResponse: { statuses: [0, 200] },
    },
  },
  {
    urlPattern:
      /^https:\/\/server\.arcgisonline\.com\/ArcGIS\/rest\/services\/World_Imagery\/MapServer\/tile\/.*/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'geojeronimo-satellite-tiles',
      expiration: { maxEntries: 180, maxAgeSeconds: 86400 },
      cacheableResponse: { statuses: [0, 200] },
    },
  },
  {
    urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
    handler: 'NetworkOnly',
  },
  {
    urlPattern: /dcrs-dados\.quallecontrol\.com\.br/i,
    handler: 'NetworkOnly',
  },
]
