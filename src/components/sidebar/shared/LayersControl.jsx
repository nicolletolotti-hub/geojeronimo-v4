import { useAppMode } from '../../../context/AppModeContext'

const LAYER_ITEMS = [
  { key: 'flood', label: '🌊 Inundação', stateKey: 'showFlood' },
  { key: 'ruas', label: '🛣️ Ruas', stateKey: 'showRuas' },
  { key: 'bairros', label: '🏙️ Bairros', stateKey: 'showBairros' },
]

export default function LayersControl({
  showFlood,
  setShowFlood,
  showRuas,
  setShowRuas,
  showBairros,
  setShowBairros,
}) {
  const { isOverlayVisible } = useAppMode()

  const stateMap = {
    showFlood: [showFlood, setShowFlood],
    showRuas: [showRuas, setShowRuas],
    showBairros: [showBairros, setShowBairros],
  }

  const visibleLayers = LAYER_ITEMS.filter((item) =>
    isOverlayVisible(item.key)
  )

  if (visibleLayers.length === 0) {
    return null
  }

  return (
    <div>
      <div className="geo-sidebar__divider" />
      <div className="geo-sidebar__section-title">Camadas</div>

      {visibleLayers.map((item) => {
        const [checked, setChecked] = stateMap[item.stateKey]

        return (
          <label
            key={item.key}
            className="geo-sidebar__label geo-sidebar__label--layer"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
            />
            {item.label}
          </label>
        )
      })}
    </div>
  )
}
