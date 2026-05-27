import { useCallback, useEffect, useMemo, useState, useRef } from 'react'

import { useAppMode } from '../context/AppModeContext'
import { useSupabase } from '../context/SupabaseContext'
import pacientesBase from '../data/acs/pacientes'
import { useSupabasePacientes } from './useSupabasePacientes'

const STORAGE_KEY = 'geojeronimo.pacientes.v1'

/**
 * Pacientes unificados: base local + Supabase (quando ativo) + cache local.
 * API inalterada para o mapa e painéis.
 */
export function usePacientes() {
  const { isIntegrationEnabled } = useAppMode()
  const { isConfigured, isAuthenticated, canManagePacientes } =
    useSupabase()

  const supabaseEnabled =
    isIntegrationEnabled('acsSync') ||
    isIntegrationEnabled('supabase')

  const {
    isActive: supabaseActive,
    pacientes: pacientesRemotos,
    addPaciente: addPacienteRemoto,
    editPaciente: editPacienteRemoto,
    removePaciente: removePacienteRemoto,
  } = useSupabasePacientes({
    enabled:
      supabaseEnabled && isConfigured && isAuthenticated,
  })

  const [pacientesLocais, setPacientesLocais] =
    useState(readStoredPacientes)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(pacientesLocais)
        )
      } catch (err) {
        console.error('Erro ao salvar pacientes locais', err)
      }
    }, 500)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [pacientesLocais])

  const pacientes = useMemo(() => {
    const remotos = supabaseActive ? pacientesRemotos : []
    const merged = [...pacientesBase, ...remotos, ...pacientesLocais]
    const seen = new Set()

    return merged.filter((paciente) => {
      const key = String(paciente.id)
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [pacientesRemotos, pacientesLocais, supabaseActive])

  const addPaciente = useCallback(
    async (paciente) => {
      if (supabaseActive && canManagePacientes) {
        const { data, error } = await addPacienteRemoto(paciente)

        if (!error && data) {
          return data
        }

        if (error) {
          console.error('Supabase addPaciente', error)
        }
      }

      const local = {
        ...paciente,
        id: `local-${Date.now()}`,
        origem: 'acs',
        criadoEm: new Date().toISOString(),
      }

      setPacientesLocais((current) => [...current, local])
      return local
    },
    [
      supabaseActive,
      canManagePacientes,
      addPacienteRemoto,
    ]
  )

  const editPaciente = useCallback(
    async (id, patch) => {
      const idStr = String(id)

      if (
        supabaseActive &&
        canManagePacientes &&
        !idStr.startsWith('local-')
      ) {
        const { data, error } = await editPacienteRemoto(id, patch)

        if (!error && data) {
          return data
        }

        if (error) {
          console.error('Supabase editPaciente', error)
        }
      }

      setPacientesLocais((current) =>
        current.map((paciente) =>
          String(paciente.id) === idStr
            ? { ...paciente, ...patch }
            : paciente
        )
      )

      return { ...patch, id }
    },
    [
      supabaseActive,
      canManagePacientes,
      editPacienteRemoto,
    ]
  )

  const removePaciente = useCallback(
    async (id) => {
      const idStr = String(id)

      if (supabaseActive && canManagePacientes && !idStr.startsWith('local-')) {
        const { error } = await removePacienteRemoto(id)

        if (!error) {
          return
        }

        console.error('Supabase removePaciente', error)
      }

      setPacientesLocais((current) =>
        current.filter((paciente) => String(paciente.id) !== idStr)
      )
    },
    [
      supabaseActive,
      canManagePacientes,
      removePacienteRemoto,
    ]
  )

  return {
    pacientes,
    pacientesLocais,
    pacientesRemotos: supabaseActive ? pacientesRemotos : [],
    supabaseActive,
    addPaciente,
    editPaciente,
    removePaciente,
  }
}

function readStoredPacientes() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)

    return stored ? JSON.parse(stored) : []
  } catch (err) {
    console.error('Erro ao carregar pacientes locais', err)
    return []
  }
}
