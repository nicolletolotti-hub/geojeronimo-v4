import { getSupabaseClient } from './client'
import { TABLES } from './constants'
import { mapPacienteRow, mapPacienteToRow } from './mappers'

export async function listPacientes() {
  const client = getSupabaseClient()
  if (!client) return { data: [], error: null }

  const { data, error } = await client
    .from(TABLES.PACIENTES)
    .select('*')
    .order('criado_em', { ascending: false })

  return {
    data: (data ?? []).map(mapPacienteRow).filter(Boolean),
    error,
  }
}

export async function createPaciente(paciente, userId) {
  const client = getSupabaseClient()
  if (!client) {
    return { data: null, error: new Error('Supabase não configurado') }
  }

  const { data, error } = await client
    .from(TABLES.PACIENTES)
    .insert(mapPacienteToRow(paciente, userId))
    .select('*')
    .single()

  return { data: mapPacienteRow(data), error }
}

export async function updatePaciente(id, patch) {
  const client = getSupabaseClient()
  if (!client) {
    return { data: null, error: new Error('Supabase não configurado') }
  }

  const row = mapPacienteToRow(patch)
  delete row.created_by

  const { data, error } = await client
    .from(TABLES.PACIENTES)
    .update({ ...row, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single()

  return { data: mapPacienteRow(data), error }
}

export async function deletePaciente(id) {
  const client = getSupabaseClient()
  if (!client) {
    return { error: new Error('Supabase não configurado') }
  }

  const { error } = await client
    .from(TABLES.PACIENTES)
    .delete()
    .eq('id', id)

  return { error }
}
