import {
  MapContainer,
  Rectangle,
  TileLayer,
} from 'react-leaflet'
import { useEffect, useMemo, useState } from 'react'

import 'leaflet/dist/leaflet.css'
import '../../styles/map.css'
import AcsLayer from './AcsLayer'
import BairroLayer from './BairroLayer'
import FloodLayer from './FloodLayer'
import RuaLayer from './RuaLayer'
import { useAppMode } from '../../context/AppModeContext'
import { useNavigation } from '../../context/NavigationContext'
import OperationsPanel from '../panels/OperationsPanel'
import PatientsPanel from '../panels/PatientsPanel'
import Sidebar from '../sidebar/Sidebar'
import Topbar from '../topbar/Topbar'
import FloatingMenu from '../ui/FloatingMenu'
import PwaInstallBanner from '../ui/PwaInstallBanner'
import bairros from '../../data/bairros/bairros.json'
import { usePacientes } from '../../hooks/usePacientes'
import {
  SAO_JERONIMO_STATION_CODE,
  fetchDcrsStation,
} from '../../services/dcrsApi'
import {
  analyzeNeighborhoodRisk,
  fetchFloodForLevel,
} from '../../utils/geoRisk'

const DCRS_POLLING_MS = 60 * 1000
const PROJECTED_RISK_DELTA = 0.6

function MapView() {
  const {
    isPanelVisible,
    isToolVisible,
    isOverlayVisible,
  } = useAppMode()

  const { sidebarOpen, toggleSidebar, openPanel, closePanel, isPanelActive } = useNavigation()

  const [level, setLevel] = useState(5)
  const [showFlood, setShowFlood] = useState(true)
  const [showRuas, setShowRuas] = useState(true)
  const [showBairros, setShowBairros] = useState(true)
  const [mapStyle, setMapStyle] = useState('satellite')
  const [selectedBairro, setSelectedBairro] = useState(null)
  const [selectedFeature, setSelectedFeature] = useState(null)
  const [selectedBairroInfo, setSelectedBairroInfo] = useState(null)
  const [showSelectedRuas, setShowSelectedRuas] = useState(true)
  const [useLiveLevel, setUseLiveLevel] = useState(true)
  const [stationData, setStationData] = useState(null)
  const [stationLoading, setStationLoading] = useState(true)
  const [stationError, setStationError] = useState(null)
  const [ruasData, setRuasData] = useState(null)
  const [currentFlood, setCurrentFlood] = useState(null)
  const [projectedFlood, setProjectedFlood] = useState(null)

  const { pacientes, addPaciente, editPaciente, removePaciente } =
    usePacientes()

  useEffect(() => {
    const controller = new AbortController()
    let mounted = true

    async function loadStationLevel() {
      setStationLoading(true)

      try {
        const station = await fetchDcrsStation(
          SAO_JERONIMO_STATION_CODE,
          controller.signal
        )

        if (!mounted) return

        setStationData(station)
        setStationError(null)

        if (useLiveLevel) {
          setLevel(station.level)
        }
      } catch (err) {
        if (!mounted || err.name === 'AbortError') return

        setStationError(err.message)
      } finally {
        if (mounted) {
          setStationLoading(false)
        }
      }
    }

    loadStationLevel()

    const interval = setInterval(
      loadStationLevel,
      DCRS_POLLING_MS
    )

    return () => {
      mounted = false
      controller.abort()
      clearInterval(interval)
    }
  }, [useLiveLevel])

  useEffect(() => {
    let mounted = true

    async function loadRuas() {
      try {
        const response = await fetch('/ruas/ruas.geojson')
        const data = await response.json()

        if (mounted) {
          setRuasData(data)
        }
      } catch (err) {
        console.error('Erro ao carregar ruas', err)
      }
    }

    loadRuas()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let mounted = true

    async function loadFloodRisk() {
      try {
        const [current, projected] = await Promise.all([
          fetchFloodForLevel(level, controller.signal),
          fetchFloodForLevel(
            level + PROJECTED_RISK_DELTA,
            controller.signal
          ),
        ])

        if (!mounted) return

        setCurrentFlood(current?.data || null)
        setProjectedFlood(projected?.data || null)
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Erro ao analisar inundacao', err)
        }
      }
    }

    loadFloodRisk()

    return () => {
      mounted = false
      controller.abort()
    }
  }, [level])

  const risk = useMemo(() => getRiskStatus(level), [level])

  const pacientesBairro = useMemo(
    () =>
      selectedBairro
        ? pacientes.filter(
            (paciente) => paciente.bairro === selectedBairro
          )
        : [],
    [pacientes, selectedBairro]
  )

  const streetRisk = useMemo(
    () =>
      analyzeNeighborhoodRisk({
        ruasData,
        bairroFeature: selectedFeature,
        currentFlood,
        projectedFlood,
      }),
    [currentFlood, projectedFlood, ruasData, selectedFeature]
  )

  return (
    <>
      <MapContainer
        center={[-29.9535, -51.722]}
        zoom={13.4}
        minZoom={11}
        maxZoom={18}
        maxBounds={[
          [-30.1, -52.05],
          [-29.75, -51.4],
        ]}
        maxBoundsViscosity={1.0}
        style={{
          height: '100vh',
          width: '100%',
        }}
      >
        <TileLayer
          attribution={
            mapStyle === 'satellite'
              ? '&copy; Esri'
              : '&copy; OpenStreetMap'
          }
          url={
            mapStyle === 'satellite'
              ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
              : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        />

        {isOverlayVisible('mask') && !selectedFeature && (
          <Rectangle
            bounds={[
              [-31, -53],
              [-29, -50],
            ]}
            pathOptions={{
              fillColor: '#000',
              fillOpacity: 0.18,
              stroke: false,
            }}
          />
        )}

        {isOverlayVisible('flood') && showFlood && (
          <FloodLayer level={level} />
        )}

        {isOverlayVisible('ruas') &&
          showRuas &&
          showSelectedRuas &&
          selectedFeature && (
          <RuaLayer
            ruasData={ruasData}
            selectedBairroFeature={selectedFeature}
            featureStatus={streetRisk.featureStatus}
          />
        )}

        {isOverlayVisible('acs') && (
          <AcsLayer
            pacientes={pacientes}
            selectedBairro={selectedBairro}
          />
        )}

        {isOverlayVisible('bairros') && showBairros && (
          <BairroLayer
            bairros={bairros}
            selectedFeature={selectedFeature}
            setSelectedBairro={setSelectedBairro}
            setSelectedFeature={setSelectedFeature}
            setSelectedBairroInfo={setSelectedBairroInfo}
            setShowSelectedRuas={setShowSelectedRuas}
          />
        )}
      </MapContainer>

      {isToolVisible('mapStyleToggle') && (
        <button
          className="geo-map-style-button"
          onClick={() =>
            setMapStyle(
              mapStyle === 'satellite' ? 'osm' : 'satellite'
            )
          }
        >
          {mapStyle === 'satellite' ? 'Mapa' : 'Satelite'}
        </button>
      )}

      {isToolVisible('sidebarToggle') && (
        <button
          className="geo-sidebar-toggle"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>
      )}

      {isPanelVisible('sidebar') && (
        <Sidebar
          level={level}
          setLevel={setLevel}
          useLiveLevel={useLiveLevel}
          setUseLiveLevel={setUseLiveLevel}
          stationData={stationData}
          stationLoading={stationLoading}
          stationError={stationError}
          showFlood={showFlood}
          setShowFlood={setShowFlood}
          showRuas={showRuas}
          setShowRuas={setShowRuas}
          showBairros={showBairros}
          setShowBairros={setShowBairros}
        />
      )}

      {isPanelVisible('operationsPanel') && selectedBairroInfo && !sidebarOpen && (
        <OperationsPanel
          level={level}
          risk={risk}
          selectedBairroInfo={selectedBairroInfo}
          stationData={stationData}
          useLiveLevel={useLiveLevel}
          streetRisk={streetRisk}
          pacientesBairro={pacientesBairro}
          addPaciente={addPaciente}
          removePaciente={removePaciente}
        />
      )}

      {isPanelVisible('patientsPanel') && !sidebarOpen && (
        <PatientsPanel
          pacientes={pacientes}
          addPaciente={addPaciente}
          editPaciente={editPaciente}
          removePaciente={removePaciente}
          selectedBairro={selectedBairro}
          focusPacienteId={null}
        />
      )}

      {isToolVisible('ruasToggle') && selectedBairro && (
        <button
          className="geo-ruas-toggle"
          onClick={() =>
            setShowSelectedRuas(!showSelectedRuas)
          }
        >
          {showSelectedRuas
            ? 'Ocultar ruas do bairro'
            : `Mostrar ruas de ${selectedBairro}`}
        </button>
      )}

      {isPanelVisible('topbar') && (
        <Topbar
          level={level}
          stationData={stationData}
          stationLoading={stationLoading}
          stationError={stationError}
          useLiveLevel={useLiveLevel}
          selectedBairro={selectedBairro}
          streetRisk={streetRisk}
          pacientes={pacientes}
          pacientesCount={pacientesBairro.length}
        />
      )}

      <FloatingMenu />
      <PwaInstallBanner />
    </>
  )
}

function getRiskStatus(level) {
  if (level >= 10) {
    return {
      text: 'Emergencia',
      color: '#ff3b3b',
    }
  }

  if (level >= 8) {
    return {
      text: 'Alerta',
      color: '#ff9800',
    }
  }

  if (level >= 6) {
    return {
      text: 'Atencao',
      color: '#ffd54f',
    }
  }

  return {
    text: 'Normal',
    color: '#55dd88',
  }
}

export default MapView
