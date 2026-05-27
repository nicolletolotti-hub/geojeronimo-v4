const DCRS_GRAPHQL_URL =
  'https://dcrs-dados.quallecontrol.com.br/graphql'

const DCRS_CLIENT = 'casa-militar-defesa-civil-rs'

const STATION_QUERY = `
  query TagsData {
    tags_data(clients: ["${DCRS_CLIENT}"]) {
      qualle_meteorologia {
        codigo
        name {
          general
          local
        }
        timestamp
        data {
          rio {
            rio_nome {
              value
            }
            rio_nivel {
              value
            }
            rio_nivel_tendencia {
              value
            }
          }
        }
      }
    }
  }
`

export const SAO_JERONIMO_STATION_CODE = 'DCRS-00093'

export function normalizeDcrsStationCode(code) {
  const digits = String(code).match(/\d+/g)?.join('')

  if (!digits) return code

  return `DCRS-${digits.padStart(5, '0')}`
}

export function formatDcrsTimestamp(
  timestamp,
  { seconds = false } = {}
) {
  const match = String(timestamp).match(
    /T(\d{2}):(\d{2})(?::(\d{2}))?/
  )

  if (match) {
    const [, hour, minute, second = '00'] = match
    return seconds
      ? `${hour}:${minute}:${second}`
      : `${hour}:${minute}`
  }

  return '--:--'
}

export async function fetchDcrsStation(
  stationCode = SAO_JERONIMO_STATION_CODE,
  signal
) {
  const response = await fetch(DCRS_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: STATION_QUERY,
    }),
    signal,
  })

  if (!response.ok) {
    throw new Error(`DCRS respondeu ${response.status}`)
  }

  const payload = await response.json()

  if (payload.errors?.length) {
    throw new Error(payload.errors[0].message)
  }

  const stations =
    payload.data?.tags_data?.qualle_meteorologia ?? []
  const normalizedCode =
    normalizeDcrsStationCode(stationCode)
  const station = stations.find(
    (item) => item.codigo === normalizedCode
  )

  if (!station) {
    throw new Error(`Estacao ${normalizedCode} nao encontrada`)
  }

  const level = Number(
    station.data?.rio?.rio_nivel?.value
  )

  if (!Number.isFinite(level)) {
    throw new Error(
      `Estacao ${normalizedCode} sem nivel valido`
    )
  }

  return {
    code: station.codigo,
    name: station.name?.general?.trim() || station.codigo,
    local: station.name?.local?.trim() || '',
    riverName: station.data?.rio?.rio_nome?.value || '',
    level,
    trend: Number(
      station.data?.rio?.rio_nivel_tendencia?.value
    ),
    timestamp: station.timestamp,
  }
}
