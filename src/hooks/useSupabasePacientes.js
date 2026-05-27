import { useCallback, useEffect, useRef, useState } from 'react'

import { useSupabase } from '../context/SupabaseContext'
import {
  createPaciente,
  deletePaciente,
  listPacientes,
  updatePaciente,
} from '../services/supabase/pacientes'
import { subscribePacientesChanges } from '../services/supabase/realtime'

/**
 * CRUD de pacientes no Supabase + preparo realtime.
 */
export function useSupabasePacientes({ enabled = true } = {}) {
  const { isConfigured, isAuthenticated, user, canManagePacientes } =
    useSupabase()

  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const reloadingRef = useRef(false)

  const isActive =
    enabled && isConfigured && isAuthenticated

  const reload = useCallback(async () => {
    if (!isActive || reloadingRef.current) {
      return
    }

    reloadingRef.current = true
    setLoading(true)
    const { data, error: fetchError } = await listPacientes()

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setError(null)
      setPacientes(data)
    }

    setLoading(false)
    reloadingRef.current = false
  }, [isActive])

  useEffect(() => {
    if (!isActive) {
      setPacientes([])
      return
    }

    let mounted = true

    async function load() {
      if (reloadingRef.current) return
      reloadingRef.current = true
      setLoading(true)
      const { data, error: fetchError } = await listPacientes()

      if (!mounted) return

      if (fetchError) {
        setError(fetchError.message)
      } else {
        setError(null)
        setPacientes(data)
      }

      setLoading(false)
      reloadingRef.current = false
    }

    load()

    return () => {
      mounted = false
      reloadingRef.current = false
    }
  }, [isActive])

  useEffect(() => {
    if (!isActive) return undefined

    return subscribePacientesChanges(() => {
      reload()
    })
  }, [isActive, reload])

  const addPaciente = useCallback(
    async (paciente) => {
      if (!isActive || !canManagePacientes) {
        return { data: null, error: new Error('Sem permissão') }
      }

      const result = await createPaciente(paciente, user?.id)
      if (!result.error) {
        await reload()
      }
      return result
    },
    [isActive, canManagePacientes, user?.id, reload]
  )

  const editPaciente = useCallback(
    async (id, patch) => {
      if (!isActive || !canManagePacientes) {
        return { data: null, error: new Error('Sem permissão') }
      }

      const result = await updatePaciente(id, patch)
      if (!result.error) {
        await reload()
      }
      return result
    },
    [isActive, canManagePacientes, reload]
  )

  const removePaciente = useCallback(
    async (id) => {
      if (!isActive || !canManagePacientes) {
        return { error: new Error('Sem permissão') }
      }

      const result = await deletePaciente(id)
      if (!result.error) {
        await reload()
      }
      return result
    },
    [isActive, canManagePacientes, reload]
  )

  return {
    isActive,
    pacientes,
    loading,
    error,
    reload,
    addPaciente,
    editPaciente,
    removePaciente,
  }
}
