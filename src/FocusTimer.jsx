import { useState, useEffect, useRef } from 'react'
import { TRACKS, trackColor } from './useAppData'
import { formatHMS, uid } from './timeUtils'
import { IconPlay, IconPause, IconStop, IconBolt } from './Icons'

export default function FocusTimer({ onLogSession, pendingFocus, onConsumeFocus, onLiveChange }) {
  const [track, setTrack] = useState(TRACKS[0].id)
  const [label, setLabel] = useState('')
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const startRef = useRef(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    onLiveChange(running ? track : null, elapsed)
  }, [running, track, elapsed])

  // If a task queue item asked to start a focus session, prefill it.
  useEffect(() => {
    if (pendingFocus) {
      setTrack(pendingFocus.track)
      setLabel(pendingFocus.title)
      onConsumeFocus()
    }
  }, [pendingFocus])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startRef.current) / 1000))
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running])

  function start() {
    startRef.current = Date.now() - elapsed * 1000
    setRunning(true)
  }

  function pause() {
    setRunning(false)
  }

  function stopAndLog() {
    if (elapsed > 0) {
      onLogSession({
        id: uid(),
        track,
        label: label.trim() || TRACKS.find((t) => t.id === track)?.label,
        start: new Date(startRef.current).toISOString(),
        end: new Date().toISOString(),
        seconds: elapsed,
      })
    }
    setRunning(false)
    setElapsed(0)
    setLabel('')
    onLiveChange(null, 0)
  }

  return (
    <div className="panel-section">
      <div className="section-head">
        <span className="section-title"><IconBolt /> Focus timer</span>
      </div>

      <div className="timer-card" style={{ '--track-color': trackColor(track) }}>
        <select
          className="select timer-track-select"
          value={track}
          onChange={(e) => setTrack(e.target.value)}
          disabled={running}
        >
          {TRACKS.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>

        <div className="timer-display mono">{formatHMS(elapsed)}</div>

        <input
          className="input timer-label-input"
          placeholder="What are you working on? (optional)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <div className="timer-controls">
          {!running ? (
            <button className="btn btn-primary" onClick={start}>
              <IconPlay /> {elapsed > 0 ? 'Resume' : 'Start'}
            </button>
          ) : (
            <button className="btn" onClick={pause}>
              <IconPause /> Pause
            </button>
          )}
          <button className="btn btn-ghost" onClick={stopAndLog} disabled={elapsed === 0}>
            <IconStop /> Stop &amp; log
          </button>
        </div>
      </div>
    </div>
  )
}
