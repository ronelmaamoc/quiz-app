export default function ProgressBar({ current, total }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color:'var(--muted)', fontFamily:"'Space Mono',monospace" }}>
          Question {current} / {total}
        </span>
        <span style={{ fontSize: 13, color:'var(--accent)', fontFamily:"'Space Mono',monospace" }}>
          {pct}%
        </span>
      </div>
      <div style={{ height: 6, background:'var(--border)', borderRadius:99, overflow:'hidden' }}>
        <div style={{
          height:'100%', width:`${pct}%`,
          background:'linear-gradient(90deg, var(--accent), var(--accent2))',
          borderRadius:99, transition:'width 0.5s cubic-bezier(.4,0,.2,1)'
        }} />
      </div>
    </div>
  )
}