import LayersControl from '../shared/LayersControl'
import LevelStatusCard from '../shared/LevelStatusCard'
import LiveLevelControl from '../shared/LiveLevelControl'
import RiskStatusCard from '../shared/RiskStatusCard'

export default function MonitoramentoSection(props) {
  return (
    <>
      <LevelStatusCard {...props} />
      <LiveLevelControl
        {...props}
        hint="Modo monitoramento: DCRS093 ao vivo disponível quando habilitado."
      />
      <RiskStatusCard level={props.level} />
      <LayersControl {...props} />
    </>
  )
}
