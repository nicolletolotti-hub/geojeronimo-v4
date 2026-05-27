import { registerSW } from 'virtual:pwa-register'

/**
 * Registra service worker e callbacks de atualização offline.
 */
export function registerPwa() {
  if (!import.meta.env.PROD) {
    return null
  }

  const updateSW = registerSW({
    immediate: true,
    onOfflineReady() {
      window.dispatchEvent(new CustomEvent('geojeronimo:offline-ready'))
    },
    onNeedRefresh() {
      window.dispatchEvent(
        new CustomEvent('geojeronimo:sw-need-refresh', {
          detail: { updateSW },
        })
      )
    },
    onRegistered(registration) {
      if (registration) {
        window.dispatchEvent(
          new CustomEvent('geojeronimo:sw-registered', {
            detail: { registration },
          })
        )
      }
    },
    onRegisterError(error) {
      console.error('Service worker registration failed', error)
    },
  })

  return updateSW
}

export function isStandaloneDisplay() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}
