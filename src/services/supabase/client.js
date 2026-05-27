import { createClient } from '@supabase/supabase-js'

import { getSupabaseEnv, isSupabaseConfigured } from './config'

/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
let client = null

/**
 * Cliente singleton; null se não configurado.
 */
export function getSupabaseClient() {
  if (!isSupabaseConfigured()) {
    return null
  }

  if (!client) {
    const { url, anonKey } = getSupabaseEnv()

    client = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'geojeronimo.supabase.auth',
      },
    })
  }

  return client
}

export function resetSupabaseClient() {
  client = null
}
