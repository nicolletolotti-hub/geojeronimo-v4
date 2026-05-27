import { useState } from 'react'

import { useSupabaseAuth } from '../../hooks/useSupabaseAuth'
import '../../styles/supabase-auth.css'

const PROFILE_LABELS = {
  admin: 'Admin',
  acs: 'ACS',
  visualizacao: 'Visualização',
}

export default function SupabaseAuthPanel() {
  const {
    isConfigured,
    isAuthenticated,
    profile,
    loading,
    authError,
    signIn,
    logout,
  } = useSupabaseAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isConfigured) {
    return (
      <div className="geo-supabase-auth" role="status">
        <span className="geo-supabase-auth__kicker">Supabase</span>
        <p className="geo-supabase-auth__status">
          Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em
          .env.local. O app segue com dados locais.
        </p>
      </div>
    )
  }

  if (isAuthenticated && profile) {
    return (
      <div className="geo-supabase-auth" role="status">
        <span className="geo-supabase-auth__kicker">Sessão ativa</span>
        <span className="geo-supabase-auth__profile">
          {PROFILE_LABELS[profile.perfil] ?? profile.perfil}
        </span>
        <p className="geo-supabase-auth__status">
          {profile.nome || profile.email}
        </p>
        <button
          type="button"
          className="geo-supabase-auth__btn geo-supabase-auth__btn--ghost"
          onClick={() => logout()}
          disabled={loading}
        >
          Sair
        </button>
      </div>
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    await signIn(email.trim(), password)
    setSubmitting(false)
  }

  return (
    <form className="geo-supabase-auth" onSubmit={handleSubmit}>
      <span className="geo-supabase-auth__kicker">Entrar — Supabase</span>
      <p className="geo-supabase-auth__status">
        Autenticação persistente para sincronizar pacientes e visitas.
      </p>

      <label className="geo-supabase-auth__field">
        <span>E-mail</span>
        <input
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label className="geo-supabase-auth__field">
        <span>Senha</span>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      {authError && (
        <p className="geo-supabase-auth__error">{authError}</p>
      )}

      <div className="geo-supabase-auth__actions">
        <button
          type="submit"
          className="geo-supabase-auth__btn geo-supabase-auth__btn--primary"
          disabled={loading || submitting}
        >
          {submitting ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </form>
  )
}
