import { GeoJSON } from 'react-leaflet'

export default function BairroLayer({
  bairros,
  selectedFeature,
  setSelectedBairro,
  setSelectedFeature: setSelectedFeatureProp,
  setShowSelectedRuas,
  setSelectedBairroInfo,
}) {
  return (
    <GeoJSON
      data={bairros}

      style={(feature) => {
        const isSelected =
          selectedFeature?.properties?.nome ===
          feature.properties?.nome

        const isOtherSelected =
          selectedFeature &&
          !isSelected

        return {
          color: isSelected
            ? '#ffffff'
            : 'rgba(255,255,255,0.68)',

          weight: isSelected ? 5 : 1.2,

          opacity: isSelected ? 1 : 0.75,

          fillColor: isSelected
            ? '#4cc9ff'
            : '#ffffff',

          fillOpacity: isSelected
            ? 0.10
            : isOtherSelected
            ? 0.05
            : 0,
        }
      }}

      onEachFeature={(feature, layer) => {
        const nome =
          feature.properties?.nome || 'Bairro'

        layer.bindTooltip(nome, {
          direction: 'top',
          sticky: true,
          opacity: 0.95,
        })

        layer.on('mouseover', () => {
          if (
            selectedFeature?.properties?.nome !==
            feature.properties?.nome
          ) {
            layer.setStyle({
              weight: 2.4,
              opacity: 0.95,
            })
          }
        })

        layer.on('mouseout', () => {
          if (
            selectedFeature?.properties?.nome !==
            feature.properties?.nome
          ) {
            layer.setStyle({
              weight: 1.2,
              opacity: 0.75,
            })
          }
        })

        layer.on('click', (e) => {
          setSelectedBairro(nome)

          setSelectedFeatureProp(feature)

          setSelectedBairroInfo({
            nome,
            fid: feature.properties?.fid,
            cotaMinima:
              feature.properties?.cota_minima,
          })

          setShowSelectedRuas(true)

          const map = e.target._map

          map.flyToBounds(
            e.target.getBounds(),
            {
              padding: [20, 20],
              maxZoom: 16,
              duration: 1.4,
            }
          )
        })
      }}
    />
  )
}
