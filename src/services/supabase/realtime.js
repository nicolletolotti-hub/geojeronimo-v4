import { getSupabaseClient } from './client'
import { REALTIME_CHANNELS, TABLES } from './constants'

/**
 * Inscrição em alterações de pacientes (preparo realtime).
 * @param {() => void} onChange
 * @returns {() => void} cleanup
 */
export function subscribePacientesChanges(onChange) {
  const client = getSupabaseClient()
  if (!client) return () => {}

  const channel = client
    .channel(REALTIME_CHANNELS.PACIENTES)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: TABLES.PACIENTES,
      },
      () => onChange()
    )
    .subscribe()

  return () => {
    client.removeChannel(channel)
  }
}

/**
 * Inscrição em alterações de visitas (preparo realtime).
 * @param {() => void} onChange
 * @returns {() => void} cleanup
 */
export function subscribeVisitasChanges(onChange) {
  const client = getSupabaseClient()
  if (!client) return () => {}

  const channel = client
    .channel(REALTIME_CHANNELS.VISITAS)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: TABLES.VISITAS,
      },
      () => onChange()
    )
    .subscribe()

  return () => {
    client.removeChannel(channel)
  }
}
