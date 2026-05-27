import { useEffect, useState } from 'react'

import { isStandaloneDisplay } from '../pwa/registerPwa'

/**
 * Prompt de instalação PWA (beforeinstallprompt).
 */
export function usePwaInstall() {
  const [installEvent, setInstallEvent] = useState(null)
  const [isInstalled, setIsInstalled] = useState(isStandaloneDisplay)
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('geojeronimo.pwa.dismissed') === '1'
  )

  useEffect(() => {
    function handleBeforeInstall(event) {
      event.preventDefault()
      setInstallEvent(event)
    }

    function handleInstalled() {
      setIsInstalled(true)
      setInstallEvent(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstall
      )
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  async function promptInstall() {
    if (!installEvent) return false

    await installEvent.prompt()
    const { outcome } = await installEvent.userChoice

    if (outcome === 'accepted') {
      setIsInstalled(true)
      setInstallEvent(null)
      return true
    }

    return false
  }

  function dismiss() {
    sessionStorage.setItem('geojeronimo.pwa.dismissed', '1')
    setDismissed(true)
  }

  return {
    canInstall: Boolean(installEvent) && !isInstalled && !dismissed,
    isInstalled,
    promptInstall,
    dismiss,
  }
}
