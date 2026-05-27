import MapView from './components/map/MapView'
import { AppModeProvider } from './context/AppModeContext'
import { SupabaseProvider } from './context/SupabaseContext'
import { NavigationProvider } from './context/NavigationContext'

function App() {
  return (
    <SupabaseProvider>
      <AppModeProvider>
        <NavigationProvider>
          <MapView />
        </NavigationProvider>
      </AppModeProvider>
    </SupabaseProvider>
  )
}

export default App