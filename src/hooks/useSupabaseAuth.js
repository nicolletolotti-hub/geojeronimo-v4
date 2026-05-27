import { useSupabase } from '../context/SupabaseContext'

/**
 * Hook fino para autenticação e perfil.
 */
export function useSupabaseAuth() {
  const {
    isConfigured,
    session,
    user,
    profile,
    loading,
    authError,
    isAuthenticated,
    canManagePacientes,
    canManageVisitas,
    isReadOnly,
    signIn,
    logout,
    refreshProfile,
  } = useSupabase()

  return {
    isConfigured,
    session,
    user,
    profile,
    loading,
    authError,
    isAuthenticated,
    canManagePacientes,
    canManageVisitas,
    isReadOnly,
    supabaseActive: isConfigured && isAuthenticated,
    signIn,
    logout,
    refreshProfile,
  }
}
