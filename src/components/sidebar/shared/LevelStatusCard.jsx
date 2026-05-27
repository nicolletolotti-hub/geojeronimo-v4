import { formatDcrsTimestamp } from '../../../services/dcrsApi'

export default function LevelStatusCard({
  level,
  stationData,
  stationLoading,
  stationError,
  title = 'Nível atual do Jacuí',
}) {
  return (
    <div className="geo-sidebar__block">
      <div className="geo-sidebar__block-title">{title}</div>
      <div className="geo-sidebar__level-value">{level.toFixed(1)}m</div>
      <div className="geo-sidebar__meta">
        {stationLoading
          ? 'Atualizando DCRS093...'
          : stationData
            ? `DCRS093 Sao Jeronimo - ${formatDcrsTimestamp(
                stationData.timestamp
              )}`
            : 'DCRS093 Sao Jeronimo'}
      </div>
      {stationError && (
        <div className="geo-sidebar__warn">
          API DCRS indisponivel. Mantendo o ultimo nivel.
        </div>
      )}
    </div>
  )
}
