import { getSupabaseClient } from './client'

export async function getAuthSession() {
  const client = getSupabaseClient()
  if (!client) return { session: null, error: null }

  const { data, error } = await client.auth.getSession()
  return { session: data.session, error }
}

export function onAuthStateChange(callback) {
  const client = getSupabaseClient()
  if (!client) return { unsubscribe: () => {} }

  const { data } = client.auth.onAuthStateChange((_event, session) => {
    callback(session)
  })

  return {
    unsubscribe: () => data.subscription.unsubscribe(),
  }
}

export async function signInWithPassword(email, password) {
  const client = getSupabaseClient()
  if (!client) {
    return { session: null, error: new Error('Supabase não configurado') }
  }

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  })

  return { session: data.session, user: data.user, error }
}

export async function signUpWithPassword(email, password, metadata = {}) {
  const client = getSupabaseClient()
  if (!client) {
    return { user: null, error: new Error('Supabase não configurado') }
  }

  const { data, error } = await client.auth.signUp({
    email,
    password,
    options: { data: metadata },
  })

  return { user: data.user, error }
}

export async function signOut() {
  const client = getSupabaseClient()
  if (!client) return { error: null }

  const { error } = await client.auth.signOut()
  return { error }
}
