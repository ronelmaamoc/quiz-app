import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar({ screen, onNav }) {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const avgPct = user && user.totalQuestions > 0
    ? Math.round((user.totalScore / user.totalQuestions) * 100)
    : null

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(8,12,20,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      height: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      {/* Logo */}
      <button onClick={() => onNav('home')} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        color: 'var(--text)', fontWeight: 800, fontSize: 17,
      }}>
        <span style={{ fontSize: 22 }}>🧠</span>
        QuizMaster
      </button>

      {/* Nav links — desktop */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <NavBtn active={screen === 'home'} onClick={() => onNav('home')}>Jouer</NavBtn>
        <NavBtn active={screen === 'leaderboard'} onClick={() => onNav('leaderboard')}>Classement 🏆</NavBtn>
      </div>

      {/* User menu */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => setMenuOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'var(--card)', border: '1.5px solid var(--border2)',
            borderRadius: 99, padding: '6px 14px 6px 6px',
            color: 'var(--text)',
          }}
        >
          <Avatar name={user?.username || '?'} size={30} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>{user?.username}</span>
          {avgPct !== null && (
            <span style={{
              fontSize: 12, color: 'var(--accent)',
              fontFamily:"'Space Mono', monospace"
            }}>{avgPct}%</span>
          )}
          <span style={{ fontSize: 10, color: 'var(--muted)' }}>▼</span>
        </button>

        {menuOpen && (
          <div style={{
            position: 'absolute', right: 0, top: '110%',
            background: 'var(--card)', border: '1.5px solid var(--border2)',
            borderRadius: 'var(--radius-sm)', minWidth: 200,
            boxShadow: '0 8px 32px #00000066', overflow: 'hidden',
            animation: 'fadeUp 0.15s ease',
          }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, marginBottom: 3 }}>{user?.username}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                {user?.gamesPlayed || 0} partie{user?.gamesPlayed !== 1 ? 's' : ''} jouée{user?.gamesPlayed !== 1 ? 's' : ''}
              </div>
            </div>
            <button
              onClick={() => { setMenuOpen(false); onNav('leaderboard') }}
              style={{ width: '100%', padding: '12px 16px', textAlign: 'left', color: 'var(--text)', fontSize: 14 }}
            >
              🏆 Voir le classement
            </button>
            <button
              onClick={() => { setMenuOpen(false); logout() }}
              style={{ width: '100%', padding: '12px 16px', textAlign: 'left', color: 'var(--danger)', fontSize: 14, borderTop: '1px solid var(--border)' }}
            >
              → Se déconnecter
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

function NavBtn({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 14px', borderRadius: 'var(--radius-sm)',
      fontSize: 14, fontWeight: 600,
      background: active ? 'var(--card2)' : 'transparent',
      color: active ? 'var(--accent)' : 'var(--text2)',
      border: active ? '1px solid var(--border2)' : '1px solid transparent',
      transition: 'all 0.15s',
    }}>
      {children}
    </button>
  )
}

export function Avatar({ name, size = 36 }) {
  const colors = ['#4f8ef7','#a78bfa','#22c55e','#f59e0b','#ef4444','#06b6d4']
  const color  = colors[(name.charCodeAt(0) || 0) % colors.length]
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color + '33', border: `2px solid ${color}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.4, fontWeight: 700, color,
      flexShrink: 0,
    }}>
      {name.charAt(0).toUpperCase()}
    </div>
  )
}