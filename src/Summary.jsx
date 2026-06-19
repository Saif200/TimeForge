import { useState, useMemo } from 'react'
import { TRACKS, trackColor } from './useAppData'
import { formatHM, todayISO } from './timeUtils'
import { IconBarChart } from './Icons'

function startOfWeek(d) {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // Monday start
  date.setDate(diff)
  date.setHours(0, 0, 0, 0)
  return date
}

export default function Summary({ sessions }) {
  const [range, setRange] = useState('today')

  const filtered = useMemo(() => {
    const now = new Date()
    if (range === 'today') {
      return sessions.filter((s) => s.start.slice(0, 10) === todayISO())
    }
    const weekStart = startOfWeek(now)
    return sessions.filter((s) => new Date(s.start) >= weekStart)
  }, [sessions, range])

  const byTrack = useMemo(() => {
    const map = {}
    for (const s of filtered) {
      map[s.track] = (map[s.track] || 0) + s.seconds
    }
    return map
  }, [filtered])

  const total = Object.values(byTrack).reduce((a, b) => a + b, 0)
  const max = Math.max(1, ...Object.values(byTrack))

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.start) - new Date(a.start))
    .slice(0, 6)

  return (
    <div className="panel-section">
      <div className="section-head">
        <span className="section-title"><IconBarChart /> Time summary</span>
        <div className="field-row" style={{ width: 'auto' }}>
          <button className={`btn btn-sm ${range === 'today' ? 'btn-primary' : ''}`} onClick={() => setRange('today')}>Today</button>
          <button className={`btn btn-sm ${range === 'week' ? 'btn-primary' : ''}`} onClick={() => setRange('week')}>This week</button>
        </div>
      </div>

      {total === 0 ? (
        <div className="empty-state">No focus sessions logged yet for this period. Start the timer to begin tracking.</div>
      ) : (
        <>
          <div className="summary-bars">
            {TRACKS.filter((t) => byTrack[t.id]).sort((a, b) => byTrack[b.id] - byTrack[a.id]).map((t) => (
              <div className="summary-row" key={t.id}>
                <span className="summary-label">{t.label}</span>
                <div className="summary-track-bar">
                  <div
                    className="summary-track-fill"
                    style={{ '--track-color': t.color, width: `${(byTrack[t.id] / max) * 100}%` }}
                  />
                </div>
                <span className="summary-time mono">{formatHM(byTrack[t.id])}</span>
              </div>
            ))}
          </div>
          <div className="summary-total mono">
            Total tracked: {formatHM(total)} {range === 'today' ? 'today' : 'this week'}
          </div>
        </>
      )}

      {recentSessions.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <div className="section-title" style={{ marginBottom: 10, fontSize: 11 }}>Recent sessions</div>
          <div className="task-list">
            {recentSessions.map((s) => (
              <div key={s.id} className="task-row" style={{ '--track-color': trackColor(s.track) }}>
                <span className="task-track-tag">{TRACKS.find((t) => t.id === s.track)?.label}</span>
                <span className="task-title">{s.label}</span>
                <span className="summary-time mono">{formatHM(s.seconds)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
