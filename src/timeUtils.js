export function formatHMS(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  return `${m}:${String(sec).padStart(2, '0')}`
}

export function formatHM(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function todayISO(d = new Date()) {
  return d.toISOString().slice(0, 10)
}

export function isToday(isoTimestamp) {
  return isoTimestamp.slice(0, 10) === todayISO()
}

export function sessionSecondsByTrack(sessions, dateFilter) {
  const map = {}
  for (const s of sessions) {
    if (dateFilter && !dateFilter(s.start)) continue
    map[s.track] = (map[s.track] || 0) + s.seconds
  }
  return map
}

export function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

export function nowHM() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function hmToMinutes(hm) {
  const [h, m] = hm.split(':').map(Number)
  return h * 60 + m
}

export function isBlockActiveNow(block) {
  const nowMin = hmToMinutes(nowHM())
  return nowMin >= hmToMinutes(block.start) && nowMin < hmToMinutes(block.end)
}
