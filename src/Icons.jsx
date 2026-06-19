// Minimal inline icon set — keeps the app dependency-free for icons.
const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function IconPlay(props) {
  return <svg width="16" height="16" viewBox="0 0 24 24" {...props}><polygon points="6 3 20 12 6 21 6 3" {...stroke} fill="currentColor" /></svg>
}
export function IconPause(props) {
  return <svg width="16" height="16" viewBox="0 0 24 24" {...props}><rect x="6" y="4" width="4" height="16" fill="currentColor" /><rect x="14" y="4" width="4" height="16" fill="currentColor" /></svg>
}
export function IconStop(props) {
  return <svg width="16" height="16" viewBox="0 0 24 24" {...props}><rect x="5" y="5" width="14" height="14" rx="2" fill="currentColor" /></svg>
}
export function IconPlus(props) {
  return <svg width="16" height="16" viewBox="0 0 24 24" {...props}><line x1="12" y1="5" x2="12" y2="19" {...stroke} /><line x1="5" y1="12" x2="19" y2="12" {...stroke} /></svg>
}
export function IconTrash(props) {
  return <svg width="14" height="14" viewBox="0 0 24 24" {...props}><polyline points="3 6 5 6 21 6" {...stroke} /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" {...stroke} /><path d="M10 11v6M14 11v6" {...stroke} /></svg>
}
export function IconCheck(props) {
  return <svg width="12" height="12" viewBox="0 0 24 24" {...props}><polyline points="20 6 9 17 4 12" {...stroke} /></svg>
}
export function IconClock(props) {
  return <svg width="14" height="14" viewBox="0 0 24 24" {...props}><circle cx="12" cy="12" r="9" {...stroke} /><polyline points="12 7 12 12 16 14" {...stroke} /></svg>
}
export function IconBolt(props) {
  return <svg width="14" height="14" viewBox="0 0 24 24" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" {...stroke} /></svg>
}
export function IconBarChart(props) {
  return <svg width="14" height="14" viewBox="0 0 24 24" {...props}><line x1="6" y1="20" x2="6" y2="10" {...stroke} /><line x1="12" y1="20" x2="12" y2="4" {...stroke} /><line x1="18" y1="20" x2="18" y2="14" {...stroke} /></svg>
}
export function IconListTodo(props) {
  return <svg width="14" height="14" viewBox="0 0 24 24" {...props}><rect x="3" y="4" width="6" height="6" rx="1" {...stroke} /><path d="M11 7h10" {...stroke} /><rect x="3" y="14" width="6" height="6" rx="1" {...stroke} /><path d="M11 17h10" {...stroke} /></svg>
}
export function IconUser(props) {
  return <svg width="14" height="14" viewBox="0 0 24 24" {...props}><circle cx="12" cy="8" r="4" {...stroke} /><path d="M4 21c0-4 4-7 8-7s8 3 8 7" {...stroke} /></svg>
}

export function BrandMark(props) {
  return (
    <svg viewBox="0 0 100 100" {...props}>
      <rect width="100" height="100" rx="20" fill="#13151A" />
      <path d="M30 70 L50 25 L70 70 M38 55 L62 55" stroke="#3DDC97" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
