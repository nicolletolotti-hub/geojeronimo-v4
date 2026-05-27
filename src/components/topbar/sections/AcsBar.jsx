import { useAppMode } from '../../../context/AppModeContext'
import { useSupabaseVisitas } from '../../../hooks/useSupabaseVisitas'
import TopbarWidget from '../shared/TopbarWidget'
import {
  countCriticalPacientes,
  countMonitoredFamilies,
  getAcsVisitsDisplay,
} from '../shared/topbarMetrics'

export default function AcsBar({ pacientes = [] }) {
  const { isIntegrationEnabled } = useAppMode()
  const { stats, isActive } = useSupabaseVisitas({
    enabled: isIntegrationEnabled('supabase'),
  })

  const visitasFallback = getAcsVisitsDisplay(pacientes)
  const visitasValue = isActive
    ? String(stats.pendentes)
    : visitasFallback.value
  const visitasMeta = isActive
    ? `${stats.realizadas} realizadas · ${stats.total} total`
    : visitasFallback.meta

  const criticos = countCriticalPacientes(pacientes)
  const familias = countMonitoredFamilies(pacientes)

  return (
    <>
      <TopbarWidget
        title="Visitas"
        value={visitasValue}
        color={isActive ? '#5eb3ff' : visitasFallback.color}
        meta={visitasMeta}
      />
      <TopbarWidget
        title="Pacientes críticos"
        value={criticos}
        color={criticos > 0 ? '#ff4d4d' : '#5eb3ff'}
        meta="Alta e crítica"
      />
      <TopbarWidget
        title="Famílias monitoradas"
        value={familias}
        color="#5eb3ff"
        meta="Cadastro territorial"
      />
    </>
  )
}
