import LayersControl from '../shared/LayersControl'
import LevelStatusCard from '../shared/LevelStatusCard'
import LiveLevelControl from '../shared/LiveLevelControl'
import SupabasePlaceholder from '../shared/SupabasePlaceholder'

export default function AcsSection(props) {
  return (
    <>
      <p className="geo-sidebar__intro">
        Painel territorial ACS: priorize bairros, ruas e marcadores de
        pacientes no território de cobertura.
      </p>

      <SupabasePlaceholder />

      <LevelStatusCard
        {...props}
        title="Referência hidrológica"
      />

      <LiveLevelControl
        {...props}
        hint="Modo ACS: ajuste manual do nível para apoio de campo."
      />

      <div className="geo-sidebar__block">
        <div className="geo-sidebar__block-title">Território ACS</div>
        <div className="geo-sidebar__chips">
          <span className="geo-sidebar__chip">Bairros</span>
          <span className="geo-sidebar__chip">Ruas</span>
          <span className="geo-sidebar__chip">Pacientes</span>
        </div>
      </div>

      <LayersControl {...props} />
    </>
  )
}
