import { projectAnchorId } from '../../data/portfolio'
import { Icon } from '../ui/Icon'
import { MotionReveal } from '../ui/MotionReveal'

const dataPath = [
  { name: 'OpenSky', note: 'Live provider' },
  { name: 'ADSB.lol', note: 'Fallback source' },
  { name: 'Flask + SQLite', note: 'Proxy and archive' },
  { name: 'Svelte + Leaflet', note: 'Map and replay' },
]

export function LiveFlightsShowcase() {
  return (
    <article
      id={projectAnchorId('live_flights_map')}
      className="project-showcase project-showcase--vision live-flights-showcase"
      data-chapter="vision"
      aria-labelledby="live-flights-title"
    >
      <MotionReveal className="live-flights-showcase__header">
        <p className="live-flights-showcase__eyebrow">05 / Real-time data</p>
        <div className="live-flights-showcase__title-row">
          <h3 id="live-flights-title">Live Flights Map</h3>
          <p>Full-stack aircraft tracking</p>
        </div>
      </MotionReveal>

      <ol className="live-flights-showcase__path" aria-label="Live Flights Map data path">
        {dataPath.map((step, index) => (
          <li key={step.name}>
            <span className="live-flights-showcase__step-index">0{index + 1}</span>
            <span className="live-flights-showcase__step-name">{step.name}</span>
            <span className="live-flights-showcase__step-note">{step.note}</span>
          </li>
        ))}
      </ol>

      <div className="live-flights-showcase__body">
        <p className="live-flights-showcase__summary">
          A live aircraft map backed by a Flask proxy. OpenSky provides the primary feed, with ADSB.lol as a fallback; archived positions support replay, search, and flight trails.
        </p>
        <div className="live-flights-showcase__notes">
          <p>The frontend uses Svelte and Leaflet to animate aircraft between snapshots, filter traffic, and inspect a selected aircraft.</p>
          <p>Regular polling is the default, with optional server-sent events. A bounding-box cache and local SQLite archive support the data path.</p>
        </div>
      </div>

      <a
        className="live-flights-showcase__link"
        href="https://github.com/MaciejZiel/live_flights_map"
        target="_blank"
        rel="noreferrer"
      >
        View repository <Icon name="arrow-up-right" />
      </a>
    </article>
  )
}
