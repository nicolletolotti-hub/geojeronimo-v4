/**
 * Configuração global de modos operacionais.
 * Cada modo define painéis, ferramentas e overlays permitidos.
 * Integrações (ACS / Supabase) ficam desligadas até implementação futura.
 */

export const APP_MODES = {
  MONITORAMENTO: 'monitoramento',
  ACS: 'acs',
  DEFESA_CIVIL: 'defesaCivil',
  SIMULACAO: 'simulacao',
}

export const DEFAULT_APP_MODE = APP_MODES.MONITORAMENTO

/** @typedef {'monitoramento' | 'acs' | 'defesaCivil' | 'simulacao'} AppModeId */

/**
 * @typedef {Object} ModeVisibilityConfig
 * @property {string} label
 * @property {Record<string, boolean>} panels
 * @property {Record<string, boolean>} tools
 * @property {Record<string, boolean>} overlays
 * @property {Record<string, boolean>} integrations
 */

/** @type {Record<AppModeId, ModeVisibilityConfig>} */
export const MODE_CONFIG = {
  [APP_MODES.MONITORAMENTO]: {
    label: 'Monitoramento',
    panels: {
      sidebar: true,
      operationsPanel: true,
      topbar: true,
      neighborhoodPanel: false,
    },
    tools: {
      mapStyleToggle: true,
      sidebarToggle: true,
      ruasToggle: true,
      floodSlider: false,
    },
    overlays: {
      flood: true,
      ruas: true,
      bairros: true,
      acs: true,
      mask: true,
    },
    integrations: {
      acsSync: false,
      supabase: false,
      liveStation: true,
    },
  },

  [APP_MODES.ACS]: {
    label: 'ACS',
    panels: {
      sidebar: true,
      operationsPanel: false,
      topbar: false,
      neighborhoodPanel: false,
      patientsPanel: true,
    },
    tools: {
      mapStyleToggle: true,
      sidebarToggle: true,
      ruasToggle: true,
      floodSlider: false,
    },
    overlays: {
      flood: false,
      ruas: true,
      bairros: true,
      acs: true,
      mask: true,
    },
    integrations: {
      acsSync: true,
      supabase: true,
      liveStation: false,
    },
  },

  [APP_MODES.DEFESA_CIVIL]: {
    label: 'Defesa Civil',
    panels: {
      sidebar: true,
      operationsPanel: true,
      topbar: true,
      neighborhoodPanel: true,
    },
    tools: {
      mapStyleToggle: true,
      sidebarToggle: true,
      ruasToggle: true,
      floodSlider: true,
    },
    overlays: {
      flood: true,
      ruas: true,
      bairros: true,
      acs: true,
      mask: true,
    },
    integrations: {
      acsSync: false,
      supabase: false,
      liveStation: true,
    },
  },

  [APP_MODES.SIMULACAO]: {
    label: 'Simulação',
    panels: {
      sidebar: true,
      operationsPanel: false,
      topbar: true,
      neighborhoodPanel: false,
    },
    tools: {
      mapStyleToggle: true,
      sidebarToggle: true,
      ruasToggle: false,
      floodSlider: true,
    },
    overlays: {
      flood: true,
      ruas: true,
      bairros: true,
      acs: false,
      mask: true,
    },
    integrations: {
      acsSync: false,
      supabase: false,
      liveStation: false,
    },
  },
}

/** Metadados visuais por modo (ícone, cor, descrição) */
export const MODE_PRESENTATION = {
  [APP_MODES.MONITORAMENTO]: {
    icon: 'monitoramento',
    color: '#3dffa8',
    accentRgb: '61, 255, 168',
    description: 'Visão integrada em tempo real',
  },
  [APP_MODES.ACS]: {
    icon: 'acs',
    color: '#5eb3ff',
    accentRgb: '94, 179, 255',
    description: 'Território e cadastro ACS',
  },
  [APP_MODES.DEFESA_CIVIL]: {
    icon: 'defesaCivil',
    color: '#ff8c42',
    accentRgb: '255, 140, 66',
    description: 'Resposta e gestão de risco',
  },
  [APP_MODES.SIMULACAO]: {
    icon: 'simulacao',
    color: '#b388ff',
    accentRgb: '179, 136, 255',
    description: 'Cenários e níveis simulados',
  },
}

export const APP_MODE_LIST = Object.values(APP_MODES).map((id) => ({
  id,
  label: MODE_CONFIG[id].label,
  ...MODE_PRESENTATION[id],
}))

/**
 * @param {string} modeId
 */
export function getModePresentation(modeId) {
  return (
    MODE_PRESENTATION[modeId] ??
    MODE_PRESENTATION[DEFAULT_APP_MODE]
  )
}

/**
 * @param {string} modeId
 * @returns {ModeVisibilityConfig}
 */
export function getModeConfig(modeId) {
  return MODE_CONFIG[modeId] ?? MODE_CONFIG[DEFAULT_APP_MODE]
}

export function isValidAppMode(modeId) {
  return Object.values(APP_MODES).includes(modeId)
}
