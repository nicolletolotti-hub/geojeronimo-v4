import TopbarWidget from '../shared/TopbarWidget'
import { getDefesaCivilMetrics } from '../shared/topbarMetrics'

export default function DefesaCivilBar({ level, streetRisk }) {
  const { alertas, areasCriticas, abrigos } =
    getDefesaCivilMetrics({ level, streetRisk })

  return (
    <>
      <TopbarWidget
        title="Alertas"
        value={alertas}
        color={alertas > 0 ? '#ff4d4d' : '#ff8c42'}
        meta="Operacionais ativos"
      />
      <TopbarWidget
        title="Áreas críticas"
        value={areasCriticas}
        color="#ff8c42"
        meta="Inundação e risco"
      />
      <TopbarWidget
        title="Abrigos ativos"
        value={abrigos}
        color={abrigos > 0 ? '#55dd88' : 'rgba(255,255,255,0.72)'}
        meta={abrigos > 0 ? 'Em operação' : 'Standby'}
      />
    </>
  )
}
