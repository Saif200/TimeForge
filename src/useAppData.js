import { useState, useEffect, useRef, useCallback } from 'react'
import { watchAuth, watchUserData, saveUserData, isFirebaseConfigured } from './firebase'

export const TRACKS = [
  { id: 'trading', label: 'Trading', color: '#3DDC97' },
  { id: 'coding', label: 'Coding', color: '#5B8DEF' },
  { id: 'content', label: 'Content/Video', color: '#F2A65A' },
  { id: 'language', label: 'English/Language', color: '#E0617B' },
  { id: 'wordpress', label: 'WordPress/SEO', color: '#9D7BE0' },
  { id: 'other', label: 'Other', color: '#7B7F8C' },
]

export function trackColor(id) {
  return TRACKS.find((t) => t.id === id)?.color || '#7B7F8C'
}
export function trackLabel(id) {
  return TRACKS.find((t) => t.id === id)?.label || 'Other'
}

const LOCAL_KEY = 'timeforge_data_v1'

function todayKey(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

function emptyData() {
  return {
    blocks: [],     // { id, title, track, start: "HH:MM", end: "HH:MM", done, date }
    tasks: [],       // { id, title, track, done, createdAt }
    sessions: [],     // { id, track, label, start: ISO, end: ISO, seconds }
  }
}

function loadLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY)
    if (raw) return { ...emptyData(), ...JSON.parse(raw) }
  } catch (e) {
    console.error('local load failed', e)
  }
  return emptyData()
}

function saveLocal(data) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data))
  } catch (e) {
    console.error('local save failed', e)
  }
}

export function useAppData() {
  const [data, setData] = useState(loadLocal)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(isFirebaseConfigured)
  const [syncStatus, setSyncStatus] = useState(isFirebaseConfigured ? 'connecting' : 'local')
  const hydratedFromCloud = useRef(false)
  const saveTimer = useRef(null)

  // auth listener
  useEffect(() => {
    const unsub = watchAuth((u) => {
      setUser(u)
      setAuthLoading(false)
      if (!u) {
        setSyncStatus(isFirebaseConfigured ? 'signed-out' : 'local')
        hydratedFromCloud.current = false
      }
    })
    return unsub
  }, [])

  // cloud data listener
  useEffect(() => {
    if (!user) return
    setSyncStatus('connecting')
    const unsub = watchUserData(user.uid, (cloudData) => {
      setData((prev) => {
        if (!hydratedFromCloud.current) {
          hydratedFromCloud.current = true
          const cloudHasContent =
            (cloudData.blocks?.length || 0) +
              (cloudData.tasks?.length || 0) +
              (cloudData.sessions?.length || 0) >
            0
          if (cloudHasContent) return { ...emptyData(), ...cloudData }
          return prev
        }
        return { ...emptyData(), ...cloudData }
      })
      setSyncStatus('synced')
    })
    return unsub
  }, [user])

  // persist on every change (debounced to cloud, instant to local)
  useEffect(() => {
    saveLocal(data)
    if (user) {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        saveUserData(user.uid, data).catch((e) => {
          console.error('cloud save failed', e)
          setSyncStatus('error')
        })
      }, 600)
    }
  }, [data, user])

  const update = useCallback((updater) => {
    setData((prev) => updater(prev))
  }, [])

  return { data, update, user, authLoading, syncStatus, today: todayKey() }
}
