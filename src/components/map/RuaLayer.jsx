import { GeoJSON } from 'react-leaflet'
import { useMemo } from 'react'

import {
  featureTouchesArea,
  getFeatureId,
  getStreetName,
} from '../../utils/geoRisk'

export default function RuaLayer({
  ruasData,
  selectedBairroFeature,
  featureStatus,
}) {
  const ruasFiltradas = useMemo(() => {
    if (!ruasData?.features || !selectedBairroFeature) return null

    return {
      ...ruasData,
      features: ruasData.features.filter((feature) =>
        featureTouchesArea(feature, selectedBairroFeature)
      ),
    }
  }, [ruasData, selectedBairroFeature])

  if (!ruasFiltradas) return null

  return (
    <GeoJSON
      key={`${selectedBairroFeature.properties?.nome}-${Object.keys(
        featureStatus
      ).join('-')}`}
      data={ruasFiltradas}
      style={(feature) => {
        const status =
          featureStatus[getFeatureId(feature)] || 'monitorada'

        return {
          color: getStreetColor(status),
          weight: status === 'monitorada' ? 1.4 : 3,
          opacity: status === 'monitorada' ? 0.72 : 0.95,
          lineCap: 'round',
          lineJoin: 'round',
          smoothFactor: 1.5,
        }
      }}
      onEachFeature={(feature, layer) => {
        const status =
          featureStatus[getFeatureId(feature)] || 'monitorada'
        const labels = {
          inundada: 'Inundada',
          risco: 'Em risco',
          monitorada: 'Monitorada',
        }

        layer.bindTooltip(
          `
          <strong>${getStreetName(feature)}</strong><br/>
          Situacao: ${labels[status]}
          `
        )
      }}
    />
  )
}

function getStreetColor(status) {
  if (status === 'inundada') return '#ff3b3b'
  if (status === 'risco') return '#ffaa00'
  return '#55ccff'
}
