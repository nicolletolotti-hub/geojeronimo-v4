import { GeoJSON } from 'react-leaflet'
import { useEffect, useState } from 'react'
import { getFloodFileForLevel } from '../../utils/geoRisk'

export default function FloodLayer({ level, onFloodLoaded }) {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function loadFlood() {
      const floodFile = getFloodFileForLevel(level)

      if (!floodFile) {
        setData(null)
        onFloodLoaded?.(null)
        return
      }

      try {
        const response = await fetch(floodFile.url)
        const json = await response.json()

        setData(json)
        onFloodLoaded?.(json)

      } catch (err) {
        console.error('Erro ao carregar inundação:', err)
      }
    }

    loadFlood()
  }, [level, onFloodLoaded])

  if (!data) return null

  return (
    <GeoJSON
      key={level}
      data={data}
      interactive={false}
      style={{
  color: '#4cc9ff',

  weight: 0.6,

  fillColor: '#3bb8ff',

  fillOpacity: 0.22,

  opacity: 0.7,

  smoothFactor: 2,
}}
    />
  )
}
