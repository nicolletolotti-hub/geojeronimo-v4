import { useMemo, useState } from 'react'

import { useNavigation } from '../../context/NavigationContext'
import { formatDcrsTimestamp } from '../../services/dcrsApi'
import { PATIENT_TYPES, PRIORITIES } from '../../config/patientConstants'

export default function OperationsPanel({
  level,
  risk,
  selectedBairroInfo,
  stationData,
  useLiveLevel,
  streetRisk,
  pacientesBairro,
  addPaciente,
  removePaciente,
}) {
  const { closePanel } = useNavigation()
  const [activeTab, setActiveTab] = useState('resumo')
  const [form, setForm] = useState(() =>
    getEmptyForm(selectedBairroInfo?.nome)
  )

  const totals = useMemo(
    () => countPatientTypes(pacientesBairro),
    [pacientesBairro]
  )

  if (!selectedBairroInfo) {
    return (
      <aside className="ops-panel ops-panel-empty">
        <div className="ops-kicker">Selecao</div>
        <h2>Nenhum bairro selecionado</h2>
        <p>Aguardando bairro para analise operacional.</p>
      </aside>
    )
  }

  function handleSubmit(event) {
    event.preventDefault()

    addPaciente({
      ...form,
      bairro: selectedBairroInfo.nome,
      lat: Number(form.lat) || null,
      lng: Number(form.lng) || null,
    })

    setForm(getEmptyForm(selectedBairroInfo.nome))
    setActiveTab('pacientes')
  }

  function updateField(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  return (
    <aside className="ops-panel">
      <div className="ops-panel-header">
        <div>
          <div className="ops-kicker">Bairro selecionado</div>
          <h2>{selectedBairroInfo.nome}</h2>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span
            className="ops-status-pill"
            style={{ color: risk.color }}
          >
            {risk.text}
          </span>
          <button
            type="button"
            className="ops-remove-button"
            onClick={closePanel}
            style={{ padding: '6px 10px' }}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="ops-tabs">
        <button
          className={activeTab === 'resumo' ? 'active' : ''}
          onClick={() => setActiveTab('resumo')}
        >
          Resumo
        </button>
        <button
          className={activeTab === 'ruas' ? 'active' : ''}
          onClick={() => setActiveTab('ruas')}
        >
          Ruas
        </button>
        <button
          className={activeTab === 'pacientes' ? 'active' : ''}
          onClick={() => setActiveTab('pacientes')}
        >
          Pacientes
        </button>
        <button
          className={activeTab === 'cadastro' ? 'active' : ''}
          onClick={() => setActiveTab('cadastro')}
        >
          Cadastro
        </button>
      </div>

      {activeTab === 'resumo' && (
        <>
          <MetricGrid
            items={[
              ['Nivel', `${level.toFixed(2)} m`],
              ['Modo', useLiveLevel ? 'DCRS093' : 'Simulacao'],
              ['Ruas inundadas', streetRisk.totals.inundadas],
              ['Ruas em risco', streetRisk.totals.risco],
              ['Pacientes', pacientesBairro.length],
              ['Prioridade critica', totals.critica],
            ]}
          />

          <SectionTitle>Leitura oficial</SectionTitle>
          <InfoLine
            label="Estacao"
            value={stationData?.code || 'DCRS-00093'}
          />
          <InfoLine
            label="Atualizacao"
            value={
              stationData?.timestamp
                ? formatDcrsTimestamp(stationData.timestamp, {
                    seconds: true,
                  })
                : 'Sem leitura'
            }
          />

          <button
            className="ops-primary-button"
            onClick={() =>
              downloadReport({
                level,
                risk,
                selectedBairroInfo,
                stationData,
                useLiveLevel,
                streetRisk,
                pacientesBairro,
              })
            }
          >
            Gerar relatorio
          </button>
        </>
      )}

      {activeTab === 'ruas' && (
        <StreetList streets={streetRisk.streets} />
      )}

      {activeTab === 'pacientes' && (
        <PatientList
          pacientes={pacientesBairro}
          removePaciente={removePaciente}
        />
      )}

      {activeTab === 'cadastro' && (
        <form className="ops-form" onSubmit={handleSubmit}>
          <label>
            Nome
            <input
              required
              value={form.nome}
              onChange={(event) =>
                updateField('nome', event.target.value)
              }
            />
          </label>

          <label>
            Rua
            <input
              value={form.rua}
              onChange={(event) =>
                updateField('rua', event.target.value)
              }
            />
          </label>

          <div className="ops-form-grid">
            <label>
              Numero
              <input
                value={form.numero}
                onChange={(event) =>
                  updateField('numero', event.target.value)
                }
              />
            </label>
            <label>
              ACS
              <input
                value={form.acs}
                onChange={(event) =>
                  updateField('acs', event.target.value)
                }
              />
            </label>
          </div>

          <div className="ops-form-grid">
            <label>
              Condicao
              <select
                value={form.tipo}
                onChange={(event) =>
                  updateField('tipo', event.target.value)
                }
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
                onChange={(event) =>
                  updateField(
                    'prioridade',
                    event.target.value
                  )
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

          <div className="ops-form-grid">
            <label>
              Latitude
              <input
                type="number"
                step="0.000001"
                value={form.lat}
                onChange={(event) =>
                  updateField('lat', event.target.value)
                }
              />
            </label>
            <label>
              Longitude
              <input
                type="number"
                step="0.000001"
                value={form.lng}
                onChange={(event) =>
                  updateField('lng', event.target.value)
                }
              />
            </label>
          </div>

          <label>
            Observacao
            <textarea
              rows="3"
              value={form.observacao}
              onChange={(event) =>
                updateField('observacao', event.target.value)
              }
            />
          </label>

          <button className="ops-primary-button" type="submit">
            Salvar paciente
          </button>
        </form>
      )}
    </aside>
  )
}

function getEmptyForm(bairro = '') {
  return {
    nome: '',
    bairro,
    rua: '',
    numero: '',
    acs: '',
    tipo: 'idoso',
    prioridade: 'media',
    lat: '',
    lng: '',
    observacao: '',
  }
}

function countPatientTypes(pacientes) {
  return pacientes.reduce(
    (acc, paciente) => {
      acc[paciente.tipo] = (acc[paciente.tipo] || 0) + 1
      acc[paciente.prioridade] =
        (acc[paciente.prioridade] || 0) + 1
      return acc
    },
    {
      critica: 0,
      alta: 0,
      media: 0,
      baixa: 0,
    }
  )
}

function MetricGrid({ items }) {
  return (
    <div className="ops-metric-grid">
      {items.map(([label, value]) => (
        <div className="ops-metric" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  )
}

function SectionTitle({ children }) {
  return <h3 className="ops-section-title">{children}</h3>
}

function InfoLine({ label, value }) {
  return (
    <div className="ops-info-line">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function StreetList({ streets }) {
  if (!streets.length) {
    return (
      <p className="ops-muted">
        Nenhuma rua localizada dentro do bairro selecionado.
      </p>
    )
  }

  return (
    <div className="ops-list">
      {streets.map((street) => (
        <div className="ops-list-item" key={street.name}>
          <div>
            <strong>{street.name}</strong>
            <span>{street.segments} trecho(s)</span>
          </div>
          <StatusTag status={street.status} />
        </div>
      ))}
    </div>
  )
}

function PatientList({ pacientes, removePaciente }) {
  if (!pacientes.length) {
    return (
      <p className="ops-muted">
        Nenhum paciente prioritario cadastrado neste bairro.
      </p>
    )
  }

  return (
    <div className="ops-list">
      {pacientes.map((paciente) => (
        <div className="ops-list-item" key={paciente.id}>
          <div>
            <strong>{paciente.nome}</strong>
            <span>
              {paciente.tipo} - {paciente['rua'] || paciente.bairro}
            </span>
          </div>
          <StatusTag status={paciente.prioridade} />
          {String(paciente.id).startsWith('local-') && (
            <button
              className="ops-remove-button"
              onClick={() => removePaciente(paciente.id)}
              type="button"
            >
              Remover
            </button>
          )}
        </div>
      ))}
    </div>
  )
}

function StatusTag({ status }) {
  const labels = {
    inundada: 'Inundada',
    risco: 'Risco',
    monitorada: 'Monitorada',
    critica: 'Critica',
    alta: 'Alta',
    media: 'Media',
    baixa: 'Baixa',
  }

  return (
    <span className={`ops-tag ops-tag-${status}`}>
      {labels[status] || status}
    </span>
  )
}

function downloadReport({
  level,
  risk,
  selectedBairroInfo,
  stationData,
  useLiveLevel,
  streetRisk,
  pacientesBairro,
}) {
  const lines = [
    'RELATORIO GEOJERONIMO',
    `Data: ${new Date().toLocaleString('pt-BR')}`,
    `Bairro: ${selectedBairroInfo.nome}`,
    `Nivel: ${level.toFixed(2)} m`,
    `Status: ${risk.text}`,
    `Modo: ${useLiveLevel ? 'DCRS093 ao vivo' : 'Simulacao manual'}`,
    `Estacao: ${stationData?.code || 'DCRS-00093'}`,
    `Atualizacao DCRS: ${
      stationData?.timestamp
        ? formatDcrsTimestamp(stationData.timestamp, {
            seconds: true,
          })
        : 'Sem leitura'
    }`,
    '',
    'Ruas inundadas:',
    ...streetRisk.streets
      .filter((street) => street.status === 'inundada')
      .map((street) => `- ${street.name}`),
    '',
    'Ruas em risco:',
    ...streetRisk.streets
      .filter((street) => street.status === 'risco')
      .map((street) => `- ${street.name}`),
    '',
    'Pacientes prioritarios:',
    ...pacientesBairro.map(
      (paciente) =>
        `- ${paciente.nome}; ${paciente.tipo}; prioridade ${paciente.prioridade}; ${paciente['rua'] || paciente.bairro}`
    ),
  ]

  const blob = new Blob([lines.join('\n')], {
    type: 'text/plain;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = `geojeronimo-${selectedBairroInfo.nome}.txt`
  link.click()
  URL.revokeObjectURL(url)
}
