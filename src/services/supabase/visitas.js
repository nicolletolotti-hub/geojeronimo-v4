import { getSupabaseClient } from './client'
import { TABLES } from './constants'
import { mapVisitaRow, mapVisitaToRow } from './mappers'

export async function listVisitas({ pacienteId, status } = {}) {
  const client = getSupabaseClient()
  if (!client) return { data: [], error: null }

  let query = client
    .from(TABLES.VISITAS)
    .select('*')
    .order('data_visita', { ascending: false })

  if (pacienteId) {
    query = query.eq('paciente_id', pacienteId)
  }

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  return {
    data: (data ?? []).map(mapVisitaRow).filter(Boolean),
    error,
  }
}

export async function createVisita(visita, userId) {
  const client = getSupabaseClient()
  if (!client) {
    return { data: null, error: new Error('Supabase não configurado') }
  }

  const { data, error } = await client
    .from(TABLES.VISITAS)
    .insert(mapVisitaToRow(visita, userId))
    .select('*')
    .single()

  return { data: mapVisitaRow(data), error }
}

export async function updateVisita(id, patch) {
  const client = getSupabaseClient()
  if (!client) {
    return { data: null, error: new Error('Supabase não configurado') }
  }

  const { data, error } = await client
    .from(TABLES.VISITAS)
    .update({
      ...patch,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*')
    .single()

  return { data: mapVisitaRow(data), error }
}

export async function deleteVisita(id) {
  const client = getSupabaseClient()
  if (!client) {
    return { error: new Error('Supabase não configurado') }
  }

  const { error } = await client
    .from(TABLES.VISITAS)
    .delete()
    .eq('id', id)

  return { error }
}
