import { createContext, useContext, useState, useCallback } from 'react'

const NavigationContext = createContext(null)

/**
 * Gerencia estado de navegação para evitar múltiplos painéis abertos
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 */
export function NavigationProvider({ children }) {
  const [activePanel, setActivePanel] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const openPanel = useCallback((panelId) => {
    // Se abrir um painel diferente de sidebar, fecha o sidebar
    if (panelId !== 'sidebar') {
      setSidebarOpen(false)
    }
    // Se abrir sidebar, fecha outros painéis
    if (panelId === 'sidebar') {
      setSidebarOpen(true)
    }
    setActivePanel(panelId)
  }, [])

  const closePanel = useCallback(() => {
    setActivePanel(null)
  }, [])

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => {
      if (!prev) {
        // Ao abrir sidebar, fecha outros painéis
        setActivePanel('sidebar')
      } else {
        setActivePanel(null)
      }
      return !prev
    })
  }, [])

  const value = {
    activePanel,
    sidebarOpen,
    openPanel,
    closePanel,
    toggleSidebar,
    isPanelActive: (panelId) => activePanel === panelId,
  }

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation deve ser usado dentro de NavigationProvider')
  }
  return context
}
