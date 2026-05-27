import {
  APP_MODES,
  getModePresentation,
} from '../../config/modeConfig'
import { useAppMode } from '../../context/AppModeContext'
import '../../styles/topbar.css'
import { useTopbarClock } from './shared/useTopbarClock'
import { TOPBAR_SECTIONS } from './sections'

export default function Topbar(props) {
  const { mode } = useAppMode()
  const presentation = getModePresentation(mode)
  const time = useTopbarClock()
  const BarSection =
    TOPBAR_SECTIONS[mode] ?? TOPBAR_SECTIONS[APP_MODES.MONITORAMENTO]

  return (
    <header
      className="geo-topbar"
      aria-label={`Barra operacional — ${presentation.label}`}
      style={{
        '--mode-accent': presentation.color,
        '--mode-accent-rgb': presentation.accentRgb,
      }}
    >
      <div className="geo-topbar__track">
        <div key={mode} className="geo-topbar__section">
          <BarSection {...props} />
        </div>
        <time
          className="geo-topbar__clock"
          dateTime={time.toISOString()}
        >
          {time.toLocaleTimeString()}
        </time>
      </div>
    </header>
  )
}
