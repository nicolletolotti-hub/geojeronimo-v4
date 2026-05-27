import { getSupabaseClient } from './client'
import { TABLES, USER_PROFILES } from './constants'
import { mapUsuarioRow } from './mappers'

export async function fetchUsuarioProfile(userId) {
  const client = getSupabaseClient()
  if (!client || !userId) {
    return { profile: null, error: null }
  }

  const { data, error } = await client
    .from(TABLES.USUARIOS)
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  return {
    profile: mapUsuarioRow(data),
    error,
  }
}

export function canManagePacientes(perfil) {
  return (
    perfil === USER_PROFILES.ADMIN || perfil === USER_PROFILES.ACS
  )
}

export function canManageVisitas(perfil) {
  return (
    perfil === USER_PROFILES.ADMIN || perfil === USER_PROFILES.ACS
  )
}

export function isReadOnlyProfile(perfil) {
  return perfil === USER_PROFILES.VISUALIZACAO
}
