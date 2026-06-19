import { useMemo } from 'react'
import { TRACKS } from './useAppData'
import { formatHM, todayISO } from './timeUtils'

export default function TickerBar({ sessions, liveTrack, liveSeconds }) {
  const byTrack = useMemo(() => {
    const map = {}
    for (const s of sessions) {
      if (s.start.slice(0, 10) !== todayISO()) continue
      map[s.track] = (map[s.track] || 0) + s.seconds
    }
    if (liveTrack) {
      map[liveTrack] = (map[liveTrack] || 0) + liveSeconds
    }
    return map
  }, [sessions, liveTrack, liveSeconds])

  return (
    <div className="ticker-wrap">
      <div className="ticker">
        {TRACKS.map((t) => {
          const secs = byTrack[t.id] || 0
          const isLive = liveTrack === t.id
          return (
            <div className={`ticker-item ${isLive ? 'live' : ''}`} key={t.id}>
              <span className="ticker-swatch" style={{ background: t.color }} />
              <span className="ticker-text">
                <span className="ticker-label">{t.label}</span>
                <span className="ticker-time mono" style={{ color: secs > 0 ? t.color : 'var(--text-dim)' }}>
                  {formatHM(secs)}
                </span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
