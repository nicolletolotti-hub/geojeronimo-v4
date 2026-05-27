import { getModePresentation } from '../../../config/modeConfig'
import { useAppMode } from '../../../context/AppModeContext'

export default function SidebarHeader() {
  const { mode, config } = useAppMode()
  const presentation = getModePresentation(mode)

  return (
    <header className="geo-sidebar__header">
      <div className="geo-sidebar__brand">GeoJeronimo</div>
      <div
        className="geo-sidebar__mode"
        style={{
          '--mode-accent': presentation.color,
          '--mode-accent-rgb': presentation.accentRgb,
        }}
      >
        <span className="geo-sidebar__mode-dot" aria-hidden="true" />
        {config.label}
      </div>
    </header>
  )
}
