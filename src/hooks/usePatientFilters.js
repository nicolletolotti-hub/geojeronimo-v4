import { useMemo, useState } from 'react'

import { QUICK_FILTERS } from '../config/patientConstants'

/**
 * Busca rápida + filtros ACS (multi-seleção AND).
 */
export function usePatientFilters(pacientes, { bairro } = {}) {
  const [query, setQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState([])

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return pacientes.filter((paciente) => {
      if (bairro && paciente.bairro !== bairro) {
        return false
      }

      if (normalizedQuery) {
        const haystack = [
          paciente.nome,
          paciente.bairro,
          paciente.rua,
          paciente.tipo,
          paciente.prioridade,
          paciente.acs,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        if (!haystack.includes(normalizedQuery)) {
          return false
        }
      }

      return activeFilters.every((filterId) => {
        const filter = QUICK_FILTERS.find((f) => f.id === filterId)
        return filter ? filter.match(paciente) : true
      })
    })
  }, [pacientes, query, activeFilters, bairro])

  function toggleFilter(filterId) {
    setActiveFilters((current) =>
      current.includes(filterId)
        ? current.filter((id) => id !== filterId)
        : [...current, filterId]
    )
  }

  function clearFilters() {
    setActiveFilters([])
    setQuery('')
  }

  return {
    query,
    setQuery,
    activeFilters,
    toggleFilter,
    clearFilters,
    filtered,
    total: pacientes.length,
    count: filtered.length,
  }
}
