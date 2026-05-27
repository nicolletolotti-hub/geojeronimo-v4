import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { isSupabaseConfigured } from '../services/supabase/config'
import {
  fetchUsuarioProfile,
  canManagePacientes,
  canManageVisitas,
  isReadOnlyProfile,
} from '../services/supabase/usuarios'
import {
  getAuthSession,
  onAuthStateChange,
  signInWithPassword,
  signOut,
} from '../services/supabase/auth'

const SupabaseContext = createContext(null)

export function SupabaseProvider({ children }) {
  const isConfigured = isSupabaseConfigured()
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(isConfigured)
  const [authError, setAuthError] = useState(null)
  const mountedRef = useRef(true)
  const requestIdRef = useRef(0)

  const loadProfile = useCallback(async (userId) => {
    if (!userId) {
      if (mountedRef.current) {
        setProfile(null)
      }
      return
    }

    const currentRequestId = ++requestIdRef.current
    const { profile: nextProfile, error } =
      await fetchUsuarioProfile(userId)

    if (error) {
      console.error('Erro ao carregar perfil', error)
    }

    if (mountedRef.current && currentRequestId === requestIdRef.current) {
      setProfile(nextProfile)
    }
  }, [])

  useEffect(() => {
    if (!isConfigured) {
      setLoading(false)
      return undefined
    }

    mountedRef.current = true

    async function init() {
      const { session: initialSession, error } =
        await getAuthSession()

      if (!mountedRef.current) return

      if (error) {
        setAuthError(error.message)
      }

      setSession(initialSession)
      await loadProfile(initialSession?.user?.id)
      setLoading(false)
    }

    init()

    const { unsubscribe } = onAuthStateChange(async (nextSession) => {
      if (!mountedRef.current) return

      setSession(nextSession)
      setAuthError(null)
      await loadProfile(nextSession?.user?.id)
      setLoading(false)
    })

    return () => {
      mountedRef.current = false
      unsubscribe()
    }
  }, [isConfigured, loadProfile])

  const signIn = useCallback(async (email, password) => {
    setAuthError(null)
    setLoading(true)

    const { session: nextSession, error } =
      await signInWithPassword(email, password)

    if (error) {
      setAuthError(error.message)
      setLoading(false)
      return { error }
    }

    setSession(nextSession)
    await loadProfile(nextSession?.user?.id)
    setLoading(false)
    return { error: null }
  }, [loadProfile])

  const logout = useCallback(async () => {
    setLoading(true)
    const { error } = await signOut()

    if (error) {
      setAuthError(error.message)
    } else {
      setSession(null)
      setProfile(null)
    }

    setLoading(false)
    return { error }
  }, [])

  const value = useMemo(
    () => ({
      isConfigured,
      session,
      user: session?.user ?? null,
      profile,
      loading,
      authError,
      isAuthenticated: Boolean(session?.user),
      canManagePacientes: canManagePacientes(profile?.perfil),
      canManageVisitas: canManageVisitas(profile?.perfil),
      isReadOnly: isReadOnlyProfile(profile?.perfil),
      signIn,
      logout,
      refreshProfile: () => loadProfile(session?.user?.id),
    }),
    [
      isConfigured,
      session,
      profile,
      loading,
      authError,
      signIn,
      logout,
      loadProfile,
    ]
  )

  return (
    <SupabaseContext.Provider value={value}>
      {children}
    </SupabaseContext.Provider>
  )
}

export function useSupabase() {
  const context = useContext(SupabaseContext)

  if (!context) {
    throw new Error(
      'useSupabase deve ser usado dentro de SupabaseProvider'
    )
  }

  return context
}
