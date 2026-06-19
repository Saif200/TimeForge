import { useState } from 'react'
import { TRACKS, trackColor } from './useAppData'
import { uid, isBlockActiveNow } from './timeUtils'
import { IconPlus, IconTrash, IconCheck } from './Icons'

export default function Schedule({ blocks, onChange }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [track, setTrack] = useState(TRACKS[0].id)
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('10:00')

  const sorted = [...blocks].sort((a, b) => a.start.localeCompare(b.start))

  function addBlock() {
    if (!title.trim()) return
    onChange([
      ...blocks,
      { id: uid(), title: title.trim(), track, start, end, done: false },
    ])
    setTitle('')
    setOpen(false)
  }

  function toggleDone(id) {
    onChange(blocks.map((b) => (b.id === id ? { ...b, done: !b.done } : b)))
  }

  function remove(id) {
    onChange(blocks.filter((b) => b.id !== id))
  }

  return (
    <div className="panel-section">
      <div className="section-head">
        <span className="section-title">Today's schedule</span>
        <button className="btn btn-sm" onClick={() => setOpen((o) => !o)}>
          <IconPlus /> Add block
        </button>
      </div>

      {open && (
        <div style={{ marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            className="input"
            placeholder="What are you doing? (e.g. TAO chart review)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addBlock()}
            autoFocus
          />
          <div className="field-row">
            <select className="select" value={track} onChange={(e) => setTrack(e.target.value)}>
              {TRACKS.map((t) => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
            <input className="input" type="time" value={start} onChange={(e) => setStart(e.target.value)} style={{ flex: '0 0 110px' }} />
            <input className="input" type="time" value={end} onChange={(e) => setEnd(e.target.value)} style={{ flex: '0 0 110px' }} />
          </div>
          <div className="field-row">
            <button className="btn btn-primary" onClick={addBlock} style={{ flex: 1 }}>Add to schedule</button>
            <button className="btn btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </div>
      )}

      {sorted.length === 0 ? (
        <div className="empty-state">No time blocks yet. Add a block to plan a fixed part of your day.</div>
      ) : (
        <div className="timeline">
          {sorted.map((b) => {
            const active = !b.done && isBlockActiveNow(b)
            return (
              <div
                key={b.id}
                className={`block-row ${active ? 'active' : ''} ${b.done ? 'done' : ''}`}
                style={{ '--track-color': trackColor(b.track) }}
              >
                <div className="block-time">
                  <span>{b.start}</span>
                  <span>{b.end}</span>
                </div>
                <div className="block-bar" />
                <div className="block-main">
                  <span className={`block-title ${b.done ? 'strike' : ''}`}>{b.title}</span>
                  <span className="block-track">{TRACKS.find((t) => t.id === b.track)?.label}</span>
                </div>
                <div className="block-actions">
                  <button
                    className={`checkbox ${b.done ? 'checked' : ''}`}
                    onClick={() => toggleDone(b.id)}
                    aria-label="Mark done"
                  >
                    {b.done && <IconCheck color="#0A0C0F" />}
                  </button>
                  <button className="btn btn-ghost btn-icon" onClick={() => remove(b.id)} aria-label="Delete block">
                    <IconTrash />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
