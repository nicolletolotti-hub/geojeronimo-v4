export { isSupabaseConfigured, getSupabaseEnv } from './config'
export { getSupabaseClient, resetSupabaseClient } from './client'
export {
  getAuthSession,
  onAuthStateChange,
  signInWithPassword,
  signUpWithPassword,
  signOut,
} from './auth'
export {
  fetchUsuarioProfile,
  canManagePacientes,
  canManageVisitas,
  isReadOnlyProfile,
} from './usuarios'
export {
  listPacientes,
  createPaciente,
  updatePaciente,
  deletePaciente,
} from './pacientes'
export {
  listVisitas,
  createVisita,
  updateVisita,
  deleteVisita,
} from './visitas'
export {
  subscribePacientesChanges,
  subscribeVisitasChanges,
} from './realtime'
export {
  TABLES,
  USER_PROFILES,
  VISITA_STATUS,
  REALTIME_CHANNELS,
} from './constants'
