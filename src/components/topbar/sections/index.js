import { APP_MODES } from '../../../config/modeConfig'
import AcsBar from './AcsBar'
import DefesaCivilBar from './DefesaCivilBar'
import MonitoramentoBar from './MonitoramentoBar'
import SimulacaoBar from './SimulacaoBar'

export const TOPBAR_SECTIONS = {
  [APP_MODES.MONITORAMENTO]: MonitoramentoBar,
  [APP_MODES.ACS]: AcsBar,
  [APP_MODES.DEFESA_CIVIL]: DefesaCivilBar,
  [APP_MODES.SIMULACAO]: SimulacaoBar,
}
