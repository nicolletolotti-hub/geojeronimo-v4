import { getModePresentation } from '../../config/modeConfig'
import { useAppMode } from '../../context/AppModeContext'
import { useNavigation } from '../../context/NavigationContext'
import '../../styles/sidebar.css'
import SidebarHeader from './shared/SidebarHeader'
import { SIDEBAR_SECTIONS } from './sections'

export default function Sidebar(props) {
  const { mode } = useAppMode()
  const { sidebarOpen } = useNavigation()
  const presentation = getModePresentation(mode)
  const Section =
    SIDEBAR_SECTIONS[mode] ?? SIDEBAR_SECTIONS.monitoramento

  return (
    <aside
      className={`geo-sidebar${!sidebarOpen ? ' geo-sidebar--collapsed' : ''}`}
      aria-label={`Painel lateral — ${presentation.label}`}
      style={{
        '--mode-accent': presentation.color,
        '--mode-accent-rgb': presentation.accentRgb,
      }}
    >
      <SidebarHeader />

      <div className="geo-sidebar__body">
        <div key={mode} className="geo-sidebar__section">
          <Section {...props} />
        </div>
      </div>
    </aside>
  )
}
