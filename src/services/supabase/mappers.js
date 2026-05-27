/**
 * Normalização entre linhas Supabase e modelo do app.
 */

export function mapPacienteRow(row) {
  if (!row) return null

  return {
    id: row.id,
    nome: row.nome,
    tipo: row.tipo,
    prioridade: row.prioridade,
    bairro: row.bairro,
    lat: row.lat,
    lng: row.lng,
    origem: row.origem || 'supabase',
    criadoEm: row.criado_em || row.created_at,
    updatedAt: row.updated_at,
    createdBy: row.created_by,
  }
}

export function mapPacienteToRow(paciente, userId) {
  return {
    nome: paciente.nome,
    tipo: paciente.tipo ?? null,
    prioridade: paciente.prioridade ?? null,
    bairro: paciente.bairro ?? null,
    lat: Number.isFinite(Number(paciente.lat))
      ? Number(paciente.lat)
      : null,
    lng: Number.isFinite(Number(paciente.lng))
      ? Number(paciente.lng)
      : null,
    origem: paciente.origem || 'supabase',
    created_by: userId ?? null,
  }
}

export function mapUsuarioRow(row) {
  if (!row) return null

  return {
    id: row.id,
    email: row.email,
    nome: row.nome,
    perfil: row.perfil,
    ativo: row.ativo ?? true,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapVisitaRow(row) {
  if (!row) return null

  return {
    id: row.id,
    pacienteId: row.paciente_id,
    acsId: row.acs_id,
    dataVisita: row.data_visita,
    status: row.status,
    observacoes: row.observacoes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapVisitaToRow(visita, userId) {
  return {
    paciente_id: visita.pacienteId,
    acs_id: userId ?? visita.acsId ?? null,
    data_visita: visita.dataVisita || new Date().toISOString(),
    status: visita.status || 'pendente',
    observacoes: visita.observacoes ?? null,
  }
}
