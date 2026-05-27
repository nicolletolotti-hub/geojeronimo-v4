import { useCallback, useEffect, useMemo, useState } from 'react'

import { useSupabase } from '../context/SupabaseContext'
import {
  createVisita,
  deleteVisita,
  listVisitas,
  updateVisita,
} from '../services/supabase/visitas'
import { subscribeVisitasChanges } from '../services/supabase/realtime'
import { VISITA_STATUS } from '../services/supabase/constants'

/**
 * CRUD de visitas + contadores para widgets operacionais.
 */
export function useSupabaseVisitas({ enabled = true } = {}) {
  const { isConfigured, isAuthenticated, user, canManageVisitas } =
    useSupabase()

  const [visitas, setVisitas] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isActive =
    enabled && isConfigured && isAuthenticated

  const reload = useCallback(async () => {
    if (!isActive) {
      setVisitas([])
      return
    }

    setLoading(true)
    const { data, error: fetchError } = await listVisitas()

    if (fetchError) {
      setError(fetchError.message)
    } else {
      setError(null)
      setVisitas(data)
    }

    setLoading(false)
  }, [isActive])

  useEffect(() => {
    reload()
  }, [reload])

  useEffect(() => {
    if (!isActive) return undefined

    return subscribeVisitasChanges(() => {
      reload()
    })
  }, [isActive, reload])

  const stats = useMemo(
    () => ({
      total: visitas.length,
      pendentes: visitas.filter(
        (v) => v.status === VISITA_STATUS.PENDENTE
      ).length,
      realizadas: visitas.filter(
        (v) => v.status === VISITA_STATUS.REALIZADA
      ).length,
    }),
    [visitas]
  )

  const addVisita = useCallback(
    async (visita) => {
      if (!isActive || !canManageVisitas) {
        return { data: null, error: new Error('Sem permissão') }
      }

      const result = await createVisita(visita, user?.id)
      if (!result.error) {
        await reload()
      }
      return result
    },
    [isActive, canManageVisitas, user?.id, reload]
  )

  const editVisita = useCallback(
    async (id, patch) => {
      if (!isActive || !canManageVisitas) {
        return { data: null, error: new Error('Sem permissão') }
      }

      const result = await updateVisita(id, patch)
      if (!result.error) {
        await reload()
      }
      return result
    },
    [isActive, canManageVisitas, reload]
  )

  const removeVisita = useCallback(
    async (id) => {
      if (!isActive || !canManageVisitas) {
        return { error: new Error('Sem permissão') }
      }

      const result = await deleteVisita(id)
      if (!result.error) {
        await reload()
      }
      return result
    },
    [isActive, canManageVisitas, reload]
  )

  return {
    isActive,
    visitas,
    stats,
    loading,
    error,
    reload,
    addVisita,
    editVisita,
    removeVisita,
  }
}
