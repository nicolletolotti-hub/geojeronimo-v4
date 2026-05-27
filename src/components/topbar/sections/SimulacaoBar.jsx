import TopbarWidget from '../shared/TopbarWidget'
import { getSimulatedImpact } from '../shared/topbarMetrics'

export default function SimulacaoBar({ level, streetRisk }) {
  const impact = getSimulatedImpact(level, streetRisk)

  return (
    <>
      <TopbarWidget
        title="Nível simulado"
        value={`${level.toFixed(1)} m`}
        color="#b388ff"
        meta="Cenário hipotético"
      />
      <TopbarWidget
        title="Impacto estimado"
        value={impact.value}
        color={impact.color}
        meta={impact.meta}
      />
    </>
  )
}
