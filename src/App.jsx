import { useState, useCallback } from 'react'
import { useAppData, TRACKS } from './useAppData'
import { isFirebaseConfigured, signIn, signOutUser } from './firebase'
import TickerBar from './TickerBar'
import Schedule from './Schedule'
import TaskQueue from './TaskQueue'
import FocusTimer from './FocusTimer'
import Summary from './Summary'
import { BrandMark, IconUser, IconClock, IconListTodo, IconBarChart, IconBolt } from './Icons'

const SYNC_LABEL = {
  local: 'Local only',
  connecting: 'Connecting…',
  synced: 'Synced',
  error: 'Sync error',
  'signed-out': 'Signed out',
}

export default function App() {
  const { data, update, user, authLoading, syncStatus } = useAppData()
  const [pendingFocus, setPendingFocus] = useState(null)
  const [liveTrack, setLiveTrack] = useState(null)
  const [liveSeconds, setLiveSeconds] = useState(0)
  const [mobileTab, setMobileTab] = useState('schedule')

  const handleLiveChange = useCallback((track, secs) => {
    setLiveTrack(track)
    setLiveSeconds(secs)
  }, [])

  function setBlocks(blocks) {
    update((prev) => ({ ...prev, blocks }))
  }
  function setTasks(tasks) {
    update((prev) => ({ ...prev, tasks }))
  }
  function logSession(session) {
    update((prev) => ({ ...prev, sessions: [...prev.sessions, session] }))
  }

  if (authLoading) {
    return (
      <div className="app">
        <div className="signin-screen">
          <BrandMark className="signin-mark" />
          <span className="signin-sub mono">Loading…</span>
        </div>
      </div>
    )
  }

  if (isFirebaseConfigured && !user) {
    return (
      <div className="app">
        <div className="signin-screen">
          <BrandMark className="signin-mark" />
          <div className="signin-title">TimeForge</div>
          <div className="signin-sub">
            Sign in to sync your schedule, tasks, and tracked time across your Chromebook and Android phone.
          </div>
          <button className="btn btn-primary" onClick={signIn}>
            <IconUser /> Sign in with Google
          </button>
          <div className="signin-sub" style={{ fontSize: 12, marginTop: 6 }}>
            Or just close this and use it locally — data stays on this device until you sign in.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <BrandMark className="brand-mark" />
          TimeForge
        </div>
        <div className="header-actions">
          <div className="sync-pill">
            <span className={`dot ${syncStatus}`} />
            <span>{SYNC_LABEL[syncStatus] || syncStatus}</span>
          </div>
          {isFirebaseConfigured && user && (
            <button className="btn-account" onClick={signOutUser}>
              <IconUser /> {user.displayName?.split(' ')[0] || 'Account'}
            </button>
          )}
        </div>
      </header>

      <TickerBar sessions={data.sessions} liveTrack={liveTrack} liveSeconds={liveSeconds} />

      <main className="main">
        <div className={`col ${mobileTab === 'schedule' || mobileTab === 'tasks' ? 'active-tab' : ''}`}>
          <Schedule blocks={data.blocks} onChange={setBlocks} />
          <TaskQueue
            tasks={data.tasks}
            onChange={setTasks}
            onStartFocus={(task) => {
              setPendingFocus(task)
              setMobileTab('timer')
            }}
          />
        </div>
        <div className={`col ${mobileTab === 'timer' || mobileTab === 'summary' ? 'active-tab' : ''}`}>
          <FocusTimer
            onLogSession={logSession}
            pendingFocus={pendingFocus}
            onConsumeFocus={() => setPendingFocus(null)}
            onLiveChange={handleLiveChange}
          />
          <Summary sessions={data.sessions} />
        </div>
      </main>

      <nav className="tab-bar">
        <button className={`tab-btn ${mobileTab === 'schedule' ? 'active' : ''}`} onClick={() => setMobileTab('schedule')}>
          <IconClock /> Schedule
        </button>
        <button className={`tab-btn ${mobileTab === 'tasks' ? 'active' : ''}`} onClick={() => setMobileTab('tasks')}>
          <IconListTodo /> Tasks
        </button>
        <button className={`tab-btn ${mobileTab === 'timer' ? 'active' : ''}`} onClick={() => setMobileTab('timer')}>
          <IconBolt /> Timer
        </button>
        <button className={`tab-btn ${mobileTab === 'summary' ? 'active' : ''}`} onClick={() => setMobileTab('summary')}>
          <IconBarChart /> Summary
        </button>
      </nav>
    </div>
  )
}
