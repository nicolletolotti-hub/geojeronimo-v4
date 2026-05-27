import LayersControl from '../shared/LayersControl'
import LevelStatusCard from '../shared/LevelStatusCard'
import LiveLevelControl from '../shared/LiveLevelControl'
import RiskStatusCard from '../shared/RiskStatusCard'

export default function DefesaCivilSection(props) {
  return (
    <>
      <p className="geo-sidebar__intro">
        Centro de resposta: monitore nível do Jacuí, situação de risco e
        camadas operacionais para coordenação da Defesa Civil.
      </p>

      <LevelStatusCard {...props} />

      <LiveLevelControl
        {...props}
        hint="Modo Defesa Civil: priorize telemetria DCRS093 ao vivo."
      />

      <RiskStatusCard level={props.level} title="Situação operacional" />

      <div className="geo-sidebar__block">
        <div className="geo-sidebar__block-title">Protocolo rápido</div>
        <div className="geo-sidebar__meta">
          Emergência ≥ 9m · Atenção ≥ 6m · Normal abaixo de 6m
        </div>
      </div>

      <LayersControl {...props} />
    </>
  )
}
