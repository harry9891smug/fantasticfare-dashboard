'use client'
import { ComposableMap, Geographies, Geography } from 'react-simple-maps'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

export default function WorldMap() {
  return (
    <div className="card">
      <div className="card-header">
        <h5>World Map</h5>
      </div>
      <div className="card-body">
        <div className="jvector-map-height">
          <ComposableMap>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill="#EAEAEC"
                    stroke="#D6D6DA"
                  />
                ))
              }
            </Geographies>
          </ComposableMap>
        </div>
      </div>
    </div>
  )
}