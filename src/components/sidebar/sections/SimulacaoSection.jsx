import LayersControl from '../shared/LayersControl'
import LiveLevelControl from '../shared/LiveLevelControl'
import RiskStatusCard from '../shared/RiskStatusCard'

export default function SimulacaoSection(props) {
  return (
    <>
      <p className="geo-sidebar__intro">
        Simule cenários de cheia ajustando o nível manualmente e observe
        inundação e risco sem depender da telemetria ao vivo.
      </p>

      <div className="geo-sidebar__block">
        <div className="geo-sidebar__block-title">Cenário simulado</div>
        <div className="geo-sidebar__level-value">
          {props.level.toFixed(1)}m
        </div>
        <div className="geo-sidebar__meta">
          Nível hipotético para exercícios e planejamento.
        </div>
      </div>

      <LiveLevelControl
        {...props}
        hint="Modo simulação: telemetria ao vivo desativada por padrão neste modo."
      />

      <RiskStatusCard level={props.level} title="Risco projetado" />

      <LayersControl {...props} />
    </>
  )
}
