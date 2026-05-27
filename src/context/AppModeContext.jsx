import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

import {
  APP_MODE_LIST,
  APP_MODES,
  DEFAULT_APP_MODE,
  getModeConfig,
  isValidAppMode,
} from '../config/modeConfig'

const AppModeContext = createContext(null)

/**
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {import('../config/modeConfig').AppModeId} [props.initialMode]
 */
export function AppModeProvider({
  children,
  initialMode = DEFAULT_APP_MODE,
}) {
  const [mode, setModeState] = useState(() =>
    isValidAppMode(initialMode) ? initialMode : DEFAULT_APP_MODE
  )

  const config = useMemo(() => getModeConfig(mode), [mode])

  const setMode = useCallback((nextMode) => {
    if (isValidAppMode(nextMode)) {
      setModeState(nextMode)
    }
  }, [])

  const isPanelVisible = useCallback(
    (key) => Boolean(config.panels[key]),
    [config]
  )

  const isToolVisible = useCallback(
    (key) => Boolean(config.tools[key]),
    [config]
  )

  const isOverlayVisible = useCallback(
    (key) => Boolean(config.overlays[key]),
    [config]
  )

  const isIntegrationEnabled = useCallback(
    (key) => Boolean(config.integrations?.[key]),
    [config]
  )

  const value = useMemo(
    () => ({
      mode,
      setMode,
      config,
      modes: APP_MODES,
      modeList: APP_MODE_LIST,
      panels: config.panels,
      tools: config.tools,
      overlays: config.overlays,
      integrations: config.integrations,
      isPanelVisible,
      isToolVisible,
      isOverlayVisible,
      isIntegrationEnabled,
    }),
    [
      mode,
      setMode,
      config,
      isPanelVisible,
      isToolVisible,
      isOverlayVisible,
      isIntegrationEnabled,
    ]
  )

  return (
    <AppModeContext.Provider value={value}>
      {children}
    </AppModeContext.Provider>
  )
}

export function useAppMode() {
  const context = useContext(AppModeContext)

  if (!context) {
    throw new Error(
      'useAppMode deve ser usado dentro de AppModeProvider'
    )
  }

  return context
}

export { APP_MODES, APP_MODE_LIST, DEFAULT_APP_MODE }
