/**
 * Fila de mutações offline — preparo para sincronização futura com Supabase.
 * Não altera fluxos atuais; use queueOfflineMutation quando offline.
 */

export const OFFLINE_QUEUE_KEY = 'geojeronimo.offline.queue.v1'

/**
 * @typedef {'paciente.create' | 'paciente.update' | 'paciente.delete' | 'visita.create'} OfflineMutationType
 * @typedef {Object} OfflineMutation
 * @property {string} id
 * @property {OfflineMutationType} type
 * @property {Record<string, unknown>} payload
 * @property {string} createdAt
 */

/**
 * @returns {OfflineMutation[]}
 */
export function readOfflineQueue() {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeOfflineQueue(queue) {
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue))
}

/**
 * @param {OfflineMutationType} type
 * @param {Record<string, unknown>} payload
 */
export function queueOfflineMutation(type, payload) {
  const entry = {
    id: `offline-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    payload,
    createdAt: new Date().toISOString(),
  }

  writeOfflineQueue([...readOfflineQueue(), entry])
  return entry
}

/** @returns {Promise<{ flushed: number; pending: number }>} */
export async function flushOfflineQueue() {
  const queue = readOfflineQueue()

  if (!queue.length) {
    return { flushed: 0, pending: 0 }
  }

  // Integração Supabase realtime / background sync virá aqui.
  return { flushed: 0, pending: queue.length }
}

export function getOfflineQueueCount() {
  return readOfflineQueue().length
}
