import { useEffect, useState } from 'react'

import { usePwaInstall } from '../../hooks/usePwaInstall'
import '../../styles/pwa-install.css'

export default function PwaInstallBanner() {
  const { canInstall, promptInstall, dismiss } = usePwaInstall()
  const [offlineReady, setOfflineReady] = useState(false)
  const [isOnline, setIsOnline] = useState(
    () => navigator.onLine
  )

  useEffect(() => {
    function handleOfflineReady() {
      setOfflineReady(true)
    }

    function handleOnline() {
      setIsOnline(true)
    }

    function handleOffline() {
      setIsOnline(false)
    }

    window.addEventListener('geojeronimo:offline-ready', handleOfflineReady)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener(
        'geojeronimo:offline-ready',
        handleOfflineReady
      )
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return (
    <>
      {!isOnline && (
        <div className="geo-pwa-offline-badge" role="status">
          Modo offline — dados em cache
        </div>
      )}

      {canInstall && (
        <aside className="geo-pwa-install" aria-label="Instalar aplicativo">
          <div className="geo-pwa-install__title">Instalar GeoJeronimo</div>
          <p className="geo-pwa-install__text">
            Adicione à tela inicial para operação rápida em campo.
            {offlineReady ? ' Conteúdo básico disponível offline.' : ''}
          </p>
          <div className="geo-pwa-install__actions">
            <button
              type="button"
              className="geo-pwa-install__btn geo-pwa-install__btn--ghost"
              onClick={dismiss}
            >
              Agora não
            </button>
            <button
              type="button"
              className="geo-pwa-install__btn geo-pwa-install__btn--primary"
              onClick={() => promptInstall()}
            >
              Instalar
            </button>
          </div>
        </aside>
      )}
    </>
  )
}
