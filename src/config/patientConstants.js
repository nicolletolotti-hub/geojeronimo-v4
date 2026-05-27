export const PATIENT_TYPES = [
  ['acamado', 'Acamado'],
  ['insulinodependente', 'Insulinodependente'],
  ['gestante', 'Gestante'],
  ['idoso', 'Idoso'],
  ['crianca', 'Criança'],
  ['deficiencia', 'Pessoa com deficiência'],
]

export const PRIORITIES = [
  ['critica', 'Crítica'],
  ['alta', 'Alta'],
  ['media', 'Média'],
  ['baixa', 'Baixa'],
]

export const QUICK_FILTERS = [
  { id: 'acamado', label: 'Acamado', match: (p) => p.tipo === 'acamado' },
  {
    id: 'gestante',
    label: 'Gestante',
    match: (p) => p.tipo === 'gestante',
  },
  {
    id: 'insulinodependente',
    label: 'Insulino',
    match: (p) => p.tipo === 'insulinodependente',
  },
  {
    id: 'prioridade',
    label: 'Prioritário',
    match: (p) =>
      p.prioridade === 'critica' || p.prioridade === 'alta',
  },
]

export function getEmptyPatientForm(bairro = '') {
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

export function patientToForm(paciente) {
  return {
    nome: paciente.nome ?? '',
    bairro: paciente.bairro ?? '',
    rua: paciente.rua ?? '',
    numero: paciente.numero ?? '',
    acs: paciente.acs ?? '',
    tipo: paciente.tipo ?? 'idoso',
    prioridade: paciente.prioridade ?? 'media',
    lat: paciente.lat ?? '',
    lng: paciente.lng ?? '',
    observacao: paciente.observacao ?? '',
  }
}
