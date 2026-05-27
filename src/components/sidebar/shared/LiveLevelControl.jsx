import { useAppMode } from '../../../context/AppModeContext'

export default function LiveLevelControl({
  level,
  setLevel,
  useLiveLevel,
  setUseLiveLevel,
  hint,
}) {
  const { isIntegrationEnabled } = useAppMode()
  const liveAvailable = isIntegrationEnabled('liveStation')

  return (
    <>
      <label className="geo-sidebar__label">
        <input
          type="checkbox"
          checked={useLiveLevel}
          onChange={() => setUseLiveLevel(!useLiveLevel)}
        />
        Usar DCRS093 ao vivo
      </label>

      {!liveAvailable && (
        <p className="geo-sidebar__intro">{hint}</p>
      )}

      <input
        type="range"
        className="geo-sidebar__slider"
        min="1"
        max="15"
        step="0.2"
        value={level}
        onChange={(event) => setLevel(Number(event.target.value))}
        disabled={useLiveLevel}
        aria-label="Nivel do rio em metros"
      />
    </>
  )
}
