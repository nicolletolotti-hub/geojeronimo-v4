import { floodFiles } from '../data/inundacao'

const STATUS_ORDER = {
  inundada: 2,
  risco: 1,
  monitorada: 0,
}

export function getFloodFileForLevel(level) {
  const keys = Object.keys(floodFiles)
    .map(Number)
    .sort((a, b) => a - b)

  if (!keys.length || level < keys[0]) {
    return null
  }

  const lower =
    [...keys].reverse().find((key) => key <= level) ?? keys[0]
  const upper =
    keys.find((key) => key >= level) ?? keys[keys.length - 1]
  const chosen =
    level - lower < upper - level ? lower : upper

  return {
    level: chosen,
    url: floodFiles[chosen],
  }
}

export async function fetchFloodForLevel(level, signal) {
  const file = getFloodFileForLevel(level)

  if (!file) return null

  const response = await fetch(file.url, { signal })

  if (!response.ok) {
    throw new Error(`Falha ao carregar inundacao ${file.level}m`)
  }

  return {
    level: file.level,
    data: await response.json(),
  }
}

export function analyzeNeighborhoodRisk({
  ruasData,
  bairroFeature,
  currentFlood,
  projectedFlood,
}) {
  if (!ruasData?.features || !bairroFeature) {
    return {
      streets: [],
      featureStatus: {},
      totals: {
        monitoradas: 0,
        inundadas: 0,
        risco: 0,
      },
    }
  }

  const grouped = new Map()
  const featureStatus = {}

  ruasData.features.forEach((feature) => {
    if (!featureTouchesArea(feature, bairroFeature)) return

    const id = getFeatureId(feature)
    const flooded =
      currentFlood && featureTouchesArea(feature, currentFlood)
    const atRisk =
      !flooded &&
      projectedFlood &&
      featureTouchesArea(feature, projectedFlood)
    const status = flooded
      ? 'inundada'
      : atRisk
      ? 'risco'
      : 'monitorada'
    const name = getStreetName(feature)
    const key = name.toLocaleLowerCase('pt-BR')

    featureStatus[id] = status

    if (!grouped.has(key)) {
      grouped.set(key, {
        name,
        status,
        segments: 0,
        ids: [],
      })
    }

    const item = grouped.get(key)
    item.segments += 1
    item.ids.push(id)

    if (STATUS_ORDER[status] > STATUS_ORDER[item.status]) {
      item.status = status
    }
  })

  const streets = [...grouped.values()].sort((a, b) => {
    const statusDiff =
      STATUS_ORDER[b.status] - STATUS_ORDER[a.status]

    if (statusDiff) return statusDiff

    return a.name.localeCompare(b.name, 'pt-BR')
  })

  return {
    streets,
    featureStatus,
    totals: {
      monitoradas: streets.length,
      inundadas: streets.filter(
        (street) => street.status === 'inundada'
      ).length,
      risco: streets.filter(
        (street) => street.status === 'risco'
      ).length,
    },
  }
}

export function featureTouchesArea(feature, areaFeature) {
  const points = collectLineSamplePoints(feature.geometry)

  return points.some((point) =>
    pointInArea(point, areaFeature.geometry || areaFeature)
  )
}

export function getFeatureId(feature) {
  return (
    feature.properties?.osm_id ||
    feature.properties?.fid ||
    feature.id
  )
}

export function getStreetName(feature) {
  return (
    feature.properties?.name ||
    feature.properties?.ref ||
    `Trecho ${feature.properties?.fid || 'sem nome'}`
  )
}

function pointInArea(point, geometry) {
  if (!geometry) return false

  if (geometry.type === 'Feature') {
    return pointInArea(point, geometry.geometry)
  }

  if (geometry.type === 'FeatureCollection') {
    return geometry.features.some((feature) =>
      pointInArea(point, feature.geometry)
    )
  }

  if (geometry.type === 'Polygon') {
    return pointInPolygon(point, geometry.coordinates)
  }

  if (geometry.type === 'MultiPolygon') {
    return geometry.coordinates.some((polygon) =>
      pointInPolygon(point, polygon)
    )
  }

  return false
}

function pointInPolygon(point, polygon) {
  const [outerRing, ...holes] = polygon

  if (!pointInRing(point, outerRing)) return false

  return !holes.some((ring) => pointInRing(point, ring))
}

function pointInRing(point, ring) {
  const [x, y] = point
  let inside = false

  for (
    let index = 0, previous = ring.length - 1;
    index < ring.length;
    previous = index++
  ) {
    const [xi, yi] = ring[index]
    const [xj, yj] = ring[previous]
    const crosses =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi

    if (crosses) inside = !inside
  }

  return inside
}

function collectLineSamplePoints(geometry) {
  if (!geometry) return []

  if (geometry.type === 'LineString') {
    return sampleLine(geometry.coordinates)
  }

  if (geometry.type === 'MultiLineString') {
    return geometry.coordinates.flatMap(sampleLine)
  }

  if (geometry.type === 'Point') {
    return [geometry.coordinates]
  }

  if (geometry.type === 'MultiPoint') {
    return geometry.coordinates
  }

  return []
}

function sampleLine(line) {
  const points = [...line]

  for (let index = 1; index < line.length; index += 1) {
    const previous = line[index - 1]
    const current = line[index]

    points.push([
      (previous[0] + current[0]) / 2,
      (previous[1] + current[1]) / 2,
    ])
  }

  return points
}
