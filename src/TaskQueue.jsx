import { useState } from 'react'
import { TRACKS, trackColor } from './useAppData'
import { uid } from './timeUtils'
import { IconPlus, IconTrash, IconCheck } from './Icons'

export default function TaskQueue({ tasks, onChange, onStartFocus }) {
  const [title, setTitle] = useState('')
  const [track, setTrack] = useState(TRACKS[0].id)

  const pending = tasks.filter((t) => !t.done).sort((a, b) => a.createdAt - b.createdAt)
  const done = tasks.filter((t) => t.done)

  function addTask() {
    if (!title.trim()) return
    onChange([...tasks, { id: uid(), title: title.trim(), track, done: false, createdAt: Date.now() }])
    setTitle('')
  }

  function toggle(id) {
    onChange(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  }

  function remove(id) {
    onChange(tasks.filter((t) => t.id !== id))
  }

  return (
    <div className="panel-section">
      <div className="section-head">
        <span className="section-title">Task queue</span>
      </div>

      <div className="field-row" style={{ marginBottom: 14 }}>
        <input
          className="input"
          placeholder="Add a task — pull from this when you have free time"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTask()}
        />
        <select className="select" value={track} onChange={(e) => setTrack(e.target.value)} style={{ flex: '0 0 150px' }}>
          {TRACKS.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
        <button className="btn btn-primary btn-icon" onClick={addTask} aria-label="Add task">
          <IconPlus />
        </button>
      </div>

      {pending.length === 0 && done.length === 0 ? (
        <div className="empty-state">Queue is empty. Add tasks for things without a fixed time — pull them in whenever you're free.</div>
      ) : (
        <div className="task-list">
          {pending.map((t) => (
            <div key={t.id} className="task-row" style={{ '--track-color': trackColor(t.track) }}>
              <button className="checkbox" onClick={() => toggle(t.id)} aria-label="Mark done" />
              <span className="task-title">{t.title}</span>
              <span className="task-track-tag">{TRACKS.find((tr) => tr.id === t.track)?.label}</span>
              <button className="btn btn-sm btn-ghost" onClick={() => onStartFocus(t)}>Focus</button>
              <button className="btn btn-ghost btn-icon" onClick={() => remove(t.id)} aria-label="Delete task">
                <IconTrash />
              </button>
            </div>
          ))}
          {done.length > 0 && (
            <>
              {pending.length > 0 && <div style={{ height: 4 }} />}
              {done.map((t) => (
                <div key={t.id} className="task-row done" style={{ '--track-color': trackColor(t.track) }}>
                  <button className="checkbox checked" onClick={() => toggle(t.id)} aria-label="Mark not done">
                    <IconCheck color="#0A0C0F" />
                  </button>
                  <span className="task-title">{t.title}</span>
                  <span className="task-track-tag">{TRACKS.find((tr) => tr.id === t.track)?.label}</span>
                  <button className="btn btn-ghost btn-icon" onClick={() => remove(t.id)} aria-label="Delete task">
                    <IconTrash />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
