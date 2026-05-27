import { useEffect, useRef, useState } from 'react'

import {
  getEmptyPatientForm,
  PATIENT_TYPES,
  patientToForm,
  PRIORITIES,
  QUICK_FILTERS,
} from '../../config/patientConstants'
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth'
import { usePatientFilters } from '../../hooks/usePatientFilters'
import { useNavigation } from '../../context/NavigationContext'
import '../../styles/patients-panel.css'

/**
 * @param {Object} props
 * @param {Array} props.pacientes
 * @param {Function} props.addPaciente
 * @param {Function} props.editPaciente
 * @param {Function} props.removePaciente
 * @param {string|null} [props.selectedBairro]
 * @param {string|number|null} [props.focusPacienteId] — futuro: abrir pelo mapa
 * @param {boolean} [props.filterByBairro]
 */
export default function PatientsPanel({
  pacientes,
  addPaciente,
  editPaciente,
  removePaciente,
  selectedBairro = null,
  focusPacienteId = null,
  filterByBairro = false,
}) {
  const { closePanel } = useNavigation()
  const {
    isConfigured,
    canManagePacientes,
    isReadOnly,
    supabaseActive,
  } = useSupabaseAuth()

  const canEdit = !isConfigured || canManagePacientes

  const [view, setView] = useState('list')
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(() =>
    getEmptyPatientForm(selectedBairro ?? '')
  )
  const [bairroFilter, setBairroFilter] = useState(
    filterByBairro ? selectedBairro : null
  )
  const [saving, setSaving] = useState(false)

  const listRef = useRef(null)

  const {
    query,
    setQuery,
    activeFilters,
    toggleFilter,
    clearFilters,
    filtered,
    total,
    count,
  } = usePatientFilters(pacientes, {
    bairro: bairroFilter || undefined,
  })

  useEffect(() => {
    if (filterByBairro && selectedBairro) {
      setBairroFilter(selectedBairro)
    }
  }, [filterByBairro, selectedBairro])

  useEffect(() => {
    if (!focusPacienteId || view !== 'list') return

    const node = listRef.current?.querySelector(
      `[data-patient-id="${focusPacienteId}"]`
    )
    node?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [focusPacienteId, filtered, view])

  function openCreate() {
    setEditingId(null)
    setForm(getEmptyPatientForm(selectedBairro ?? bairroFilter ?? ''))
    setView('form')
  }

  function openEdit(paciente) {
    setEditingId(paciente.id)
    setForm(patientToForm(paciente))
    setView('form')
  }

  function closeForm() {
    setView('list')
    setEditingId(null)
  }

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!canEdit) return

    setSaving(true)

    const payload = {
      ...form,
      bairro: form.bairro || selectedBairro || bairroFilter || '',
      lat: Number(form.lat) || null,
      lng: Number(form.lng) || null,
    }

    if (editingId && isEditablePaciente({ id: editingId }, supabaseActive)) {
      await editPaciente(editingId, payload)
    } else if (!editingId) {
      await addPaciente(payload)
    }

    setSaving(false)
    closeForm()
  }

  async function handleRemove() {
    if (!editingId || !canEdit) return
    if (!isEditablePaciente({ id: editingId }, supabaseActive)) return

    await removePaciente(editingId)
    closeForm()
  }

  if (view === 'form') {
    const editable =
      !editingId ||
      isEditablePaciente({ id: editingId }, supabaseActive)

    return (
      <aside className="patients-panel" aria-label="Cadastro de paciente">
        <header className="patients-panel__header">
          <div>
            <div className="patients-panel__kicker">ACS</div>
            <h2>{editingId ? 'Editar paciente' : 'Novo paciente'}</h2>
          </div>
        </header>

        <form className="patients-panel__form" onSubmit={handleSubmit}>
          {!editable && (
            <p className="patients-panel__form-hint">
              Paciente de referência local — crie um novo cadastro para
              alterações permanentes.
            </p>
          )}

          <label>
            Nome *
            <input
              required
              value={form.nome}
              disabled={!canEdit || !editable}
              onChange={(e) => updateField('nome', e.target.value)}
            />
          </label>

          <label>
            Bairro
            <input
              value={form.bairro}
              disabled={!canEdit || !editable}
              onChange={(e) => updateField('bairro', e.target.value)}
            />
          </label>

          <label>
            Rua
            <input
              value={form.rua}
              disabled={!canEdit || !editable}
              onChange={(e) => updateField('rua', e.target.value)}
            />
          </label>

          <div className="patients-panel__form-grid">
            <label>
              Condição
              <select
                value={form.tipo}
                disabled={!canEdit || !editable}
                onChange={(e) => updateField('tipo', e.target.value)}
              >
                {PATIENT_TYPES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Prioridade
              <select
                value={form.prioridade}
                disabled={!canEdit || !editable}
                onChange={(e) =>
                  updateField('prioridade', e.target.value)
                }
              >
                {PRIORITIES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="patients-panel__form-grid">
            <label>
              Latitude
              <input
                type="number"
                step="0.000001"
                value={form.lat}
                disabled={!canEdit || !editable}
                onChange={(e) => updateField('lat', e.target.value)}
              />
            </label>
            <label>
              Longitude
              <input
                type="number"
                step="0.000001"
                value={form.lng}
                disabled={!canEdit || !editable}
                onChange={(e) => updateField('lng', e.target.value)}
              />
            </label>
          </div>

          <label>
            Observação
            <textarea
              rows={3}
              value={form.observacao}
              disabled={!canEdit || !editable}
              onChange={(e) =>
                updateField('observacao', e.target.value)
              }
            />
          </label>

          <div className="patients-panel__footer">
            <button
              type="button"
              className="patients-panel__btn patients-panel__btn--ghost"
              onClick={closeForm}
            >
              Voltar
            </button>
            <button
              type="submit"
              className="patients-panel__btn patients-panel__btn--primary"
              disabled={
                saving ||
                !canEdit ||
                (editingId && !editable)
              }
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>

          {editingId &&
            editable &&
            canEdit && (
              <button
                type="button"
                className="patients-panel__btn patients-panel__btn--ghost"
                onClick={handleRemove}
              >
                Remover cadastro
              </button>
            )}
        </form>
      </aside>
    )
  }

  return (
    <aside className="patients-panel" aria-label="Pacientes ACS">
      <header className="patients-panel__header">
        <div>
          <div className="patients-panel__kicker">Operação ACS</div>
          <h2>Pacientes</h2>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="patients-panel__count">
            {count}/{total}
          </span>
          <button
            type="button"
            className="patients-panel__btn patients-panel__btn--ghost"
            onClick={closePanel}
            style={{ padding: '6px 10px', minWidth: 'auto' }}
          >
            ✕
          </button>
        </div>
      </header>

      <div className="patients-panel__toolbar">
        <input
          type="search"
          className="patients-panel__search"
          placeholder="Busca rápida: nome, bairro, rua..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar pacientes"
        />

        <div className="patients-panel__filters">
          {QUICK_FILTERS.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={`patients-panel__filter${
                activeFilters.includes(filter.id)
                  ? ' patients-panel__filter--active'
                  : ''
              }`}
              onClick={() => toggleFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {bairroFilter && (
          <div className="patients-panel__bairro-chip">
            Bairro: <strong>{bairroFilter}</strong>
            <button type="button" onClick={() => setBairroFilter(null)}>
              Limpar
            </button>
          </div>
        )}

        {selectedBairro && !bairroFilter && (
          <button
            type="button"
            className="patients-panel__filter patients-panel__filter--active"
            onClick={() => setBairroFilter(selectedBairro)}
          >
            Filtrar: {selectedBairro}
          </button>
        )}

        {(query || activeFilters.length > 0 || bairroFilter) && (
          <button
            type="button"
            className="patients-panel__filter"
            onClick={clearFilters}
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="patients-panel__body" ref={listRef}>
        {filtered.length === 0 ? (
          <p className="patients-panel__empty">
            Nenhum paciente encontrado. Ajuste a busca ou cadastre um
            novo.
          </p>
        ) : (
          <div className="patients-panel__list">
            {filtered.map((paciente) => (
              <button
                key={paciente.id}
                type="button"
                data-patient-id={paciente.id}
                className={`patients-panel__item${
                  String(focusPacienteId) === String(paciente.id)
                    ? ' patients-panel__item--focus'
                    : ''
                }`}
                onClick={() => openEdit(paciente)}
              >
                <div>
                  <strong>{paciente.nome}</strong>
                  <span>
                    {paciente.tipo} · {paciente.bairro || 'Sem bairro'}
                    {paciente.rua ? ` · ${paciente.rua}` : ''}
                  </span>
                </div>
                <span
                  className={`patients-panel__tag patients-panel__tag--${paciente.prioridade}`}
                >
                  {paciente.prioridade}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <footer className="patients-panel__footer">
        <button
          type="button"
          className="patients-panel__btn patients-panel__btn--ghost"
          onClick={clearFilters}
        >
          Limpar
        </button>
        <button
          type="button"
          className="patients-panel__btn patients-panel__btn--primary"
          onClick={openCreate}
          disabled={(isConfigured && isReadOnly) || !canEdit}
        >
          + Novo
        </button>
      </footer>
    </aside>
  )
}

function isEditablePaciente(paciente, supabaseActive) {
  const id = String(paciente.id)

  if (id.startsWith('local-')) return true

  if (supabaseActive && /^[0-9a-f-]{36}$/i.test(id)) {
    return true
  }

  return false
}
