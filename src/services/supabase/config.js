/**
 * Configuração Supabase via variáveis Vite.
 * Sem URL/chave o app opera apenas com dados locais.
 */
export function getSupabaseEnv() {
  return {
    url: import.meta.env.VITE_SUPABASE_URL?.trim() || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY?.trim() || '',
  }
}

export function isSupabaseConfigured() {
  const { url, anonKey } = getSupabaseEnv()
  return Boolean(url && anonKey)
}
