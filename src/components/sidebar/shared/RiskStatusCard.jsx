export default function RiskStatusCard({ level, title = 'Situação' }) {
  const riskClass =
    level >= 9
      ? 'geo-sidebar__risk geo-sidebar__risk--danger'
      : level >= 6
        ? 'geo-sidebar__risk geo-sidebar__risk--warn'
        : 'geo-sidebar__risk'

  const riskLabel =
    level >= 9
      ? '🔴 Emergência'
      : level >= 6
        ? '🟠 Atenção'
        : '🟢 Normal'

  return (
    <div className={riskClass}>
      <div className="geo-sidebar__risk-label">{title}</div>
      <div className="geo-sidebar__risk-value">{riskLabel}</div>
    </div>
  )
}
