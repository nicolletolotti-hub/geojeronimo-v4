import { APP_MODES } from '../../../config/modeConfig'
import AcsSection from './AcsSection'
import DefesaCivilSection from './DefesaCivilSection'
import MonitoramentoSection from './MonitoramentoSection'
import SimulacaoSection from './SimulacaoSection'

export const SIDEBAR_SECTIONS = {
  [APP_MODES.MONITORAMENTO]: MonitoramentoSection,
  [APP_MODES.ACS]: AcsSection,
  [APP_MODES.DEFESA_CIVIL]: DefesaCivilSection,
  [APP_MODES.SIMULACAO]: SimulacaoSection,
}
