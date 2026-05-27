/**
 * Métricas derivadas para widgets da topbar (somente leitura).
 */

export function formatRiverTrend(trend) {
  if (!Number.isFinite(trend)) {
    return { value: '—', color: 'rgba(255,255,255,0.72)' }
  }

  if (trend > 0.05) {
    return {
      value: `↑ ${trend.toFixed(2)} m/h`,
      color: '#ff8c42',
      meta: 'Subindo',
    }
  }

  if (trend < -0.05) {
    return {
      value: `↓ ${Math.abs(trend).toFixed(2)} m/h`,
      color: '#55dd88',
      meta: 'Descendo',
    }
  }

  return {
    value: '→ Estável',
    color: '#4cc9ff',
    meta: 'Estável',
  }
}

export function getRainfallDisplay() {
  return {
    value: 'N/D',
    color: 'rgba(255,255,255,0.72)',
    meta: 'Integração meteorológica futura',
  }
}

export function countCriticalPacientes(pacientes = []) {
  return pacientes.filter(
    (paciente) =>
      paciente.prioridade === 'critica' ||
      paciente.prioridade === 'alta'
  ).length
}

export function countMonitoredFamilies(pacientes = []) {
  return pacientes.length
}

export function getAcsVisitsDisplay(pacientes = []) {
  const locais = pacientes.filter(
    (paciente) => paciente.origem === 'acs'
  ).length

  return {
    value: locais > 0 ? String(locais) : '—',
    color: '#5eb3ff',
    meta: locais > 0 ? 'Registros locais hoje' : 'Sync Supabase futuro',
  }
}

export function getDefesaCivilMetrics({ level, streetRisk }) {
  const inundadas = streetRisk?.totals?.inundadas ?? 0
  const alertas =
    (level >= 9 ? 2 : level >= 6 ? 1 : 0) + inundadas
  const areasCriticas = Math.max(
    inundadas,
    level >= 9 ? 3 : level >= 6 ? 1 : 0
  )
  const abrigos =
    level >= 9 ? 3 : level >= 6 ? 1 : 0

  return { alertas, areasCriticas, abrigos }
}

export function getSimulatedImpact(level, streetRisk) {
  const inundadas = streetRisk?.totals?.inundadas ?? 0
  const monitoradas = streetRisk?.totals?.monitoradas ?? 0

  if (monitoradas > 0) {
    const pct = Math.round((inundadas / monitoradas) * 100)
    return {
      value: `${pct}%`,
      color: pct >= 50 ? '#ff4d4d' : pct >= 25 ? '#ffaa00' : '#b388ff',
      meta: `${inundadas} ruas afetadas`,
    }
  }

  const pct = Math.round((level / 15) * 100)
  return {
    value: `${pct}%`,
    color: '#b388ff',
    meta: 'Estimativa por nível',
  }
}
