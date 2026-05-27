import { CircleMarker, Popup } from 'react-leaflet'

export default function AcsLayer({
  pacientes,
  selectedBairro,
}) {
  const pacientesFiltrados = selectedBairro
    ? pacientes.filter(
        (paciente) =>
          paciente.bairro === selectedBairro &&
          Number.isFinite(Number(paciente.lat)) &&
          Number.isFinite(Number(paciente.lng))
      )
    : []

  return (
    <>
      {pacientesFiltrados.map((paciente) => (
        <CircleMarker
          key={paciente.id}
          center={[Number(paciente.lat), Number(paciente.lng)]}
          radius={8}
          pathOptions={{
            color: getColor(paciente.prioridade),
            fillColor: getColor(paciente.prioridade),
            fillOpacity: 0.9,
            weight: 2,
          }}
        >
          <Popup>
            <div
              style={{
                minWidth: '180px',
              }}
            >
              <strong>{paciente.nome}</strong>
              <br />
              {paciente.tipo}
              <br />
              Prioridade: {paciente.prioridade}
              {paciente['rua'] && (
                <>
                  <br />
                  Rua: {paciente['rua']}
                </>
              )}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  )
}

function getColor(prioridade) {
  if (prioridade === 'critica') return '#ff2d2d'
  if (prioridade === 'alta') return '#ff8800'
  if (prioridade === 'media') return '#ffd54f'
  return '#55dd88'
}
