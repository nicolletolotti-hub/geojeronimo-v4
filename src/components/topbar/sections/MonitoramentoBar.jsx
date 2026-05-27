import TopbarWidget from '../shared/TopbarWidget'
import {
  formatRiverTrend,
  getRainfallDisplay,
} from '../shared/topbarMetrics'

export default function MonitoramentoBar({
  level,
  stationData,
}) {
  const trend = formatRiverTrend(stationData?.trend)
  const rain = getRainfallDisplay()

  return (
    <>
      <TopbarWidget
        title="Nível Jacuí"
        value={`${level.toFixed(1)} m`}
        color="#4cc9ff"
        meta={stationData?.code || 'DCRS093'}
      />
      <TopbarWidget
        title="Tendência"
        value={trend.value}
        color={trend.color}
        meta={trend.meta}
      />
      <TopbarWidget
        title="Chuva"
        value={rain.value}
        color={rain.color}
        meta={rain.meta}
      />
    </>
  )
}
