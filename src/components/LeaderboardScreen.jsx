import { useEffect, useState } from 'react'
import { useLeaderboard } from '../hooks/useScores'
import { useAuth } from '../context/AuthContext'
import { Avatar } from './Navbar'

const DOMAIN_LABELS = {
  mathematiques: '∑ Maths',
  histoire:      '⏳ Histoire',
  geographie:    '🌍 Géographie',
  sciences:      '⚗️ Sciences',
}

const MEDALS = ['🥇','🥈','🥉']
const MEDAL_COLORS = ['var(--gold)','var(--silver)','var(--bronze)']

export default function LeaderboardScreen() {
  const { user } = useAuth()
  const [board, setBoard] = useState([])
  const [filter, setFilter] = useState('global')   // 'global' | domain name
  const [domains, setDomains] = useState([])

  useEffect(() => {
    const raw = useLeaderboard()
    setBoard(raw)
    // Collect all domains
    const ds = new Set()
    raw.forEach(u => Object.keys(u.bestByDomain || {}).forEach(d => ds.add(d)))
    setDomains([...ds])
  }, [])

  // Sorted list selon filtre
  const displayed = filter === 'global'
    ? board
    : board
        .filter(u => u.bestByDomain?.[filter])
        .map(u => ({ ...u, _filtered: u.bestByDomain[filter] }))
        .sort((a, b) => b._filtered.pct - a._filtered.pct)

  return (
    <div style={{
      minHeight: '100vh', paddingTop: 80, padding: '80px 20px 40px',
      maxWidth: 720, margin: '0 auto',
    }}>
      {/* Header */}
      <div style={{ marginBottom: 36, animation: 'fadeUp 0.35s ease' }}>
        <div style={{
          fontFamily:"'Space Mono', monospace",
          fontSize: 12, color: 'var(--muted)',
          letterSpacing: '0.12em', marginBottom: 10, textTransform: 'uppercase'
        }}>
          Classement général
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 6 }}>
          Meilleurs joueurs 🏆
        </h1>
        <p style={{ color: 'var(--text2)', fontSize: 15 }}>
          Classés par taux de bonnes réponses moyen.
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{
        display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28,
      }}>
        <FilterBtn active={filter === 'global'} onClick={() => setFilter('global')}>
          Global
        </FilterBtn>
        {domains.map(d => (
          <FilterBtn key={d} active={filter === d} onClick={() => setFilter(d)}>
            {DOMAIN_LABELS[d] || d}
          </FilterBtn>
        ))}
      </div>

      {/* Empty */}
      {displayed.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: 'var(--card)', border: '1.5px solid var(--border)',
          borderRadius: 'var(--radius)', color: 'var(--muted)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <p>Aucun score enregistré dans ce domaine.</p>
        </div>
      )}

      {/* Podium (top 3 global) */}
      {filter === 'global' && displayed.length >= 3 && (
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 12, marginBottom: 28,
        }}>
          {[displayed[1], displayed[0], displayed[2]].map((u, vi) => {
            const realRank = vi === 0 ? 1 : vi === 1 ? 0 : 2
            if (!u) return <div key={vi} />
            const isSelf = u.id === user?.id
            return (
              <div key={u.id} style={{
                background: 'var(--card)',
                border: `1.5px solid ${isSelf ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                padding: '20px 14px', textAlign: 'center',
                order: vi === 1 ? -1 : vi,
                transform: vi === 1 ? 'translateY(-10px)' : 'none',
                position: 'relative',
                boxShadow: vi === 1 ? '0 8px 32px #4f8ef722' : 'none',
              }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{MEDALS[realRank]}</div>
                <Avatar name={u.username} size={44} />
                <div style={{
                  fontWeight: 700, marginTop: 10, fontSize: 14,
                  color: isSelf ? 'var(--accent)' : 'var(--text)',
                }}>
                  {u.username}{isSelf ? ' (moi)' : ''}
                </div>
                <div style={{
                  fontSize: 22, fontWeight: 900,
                  color: MEDAL_COLORS[realRank], marginTop: 6,
                }}>
                  {u.avgPct}%
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                  {u.gamesPlayed} partie{u.gamesPlayed !== 1 ? 's' : ''}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Full list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {displayed.map((u, i) => {
          const isSelf = u.id === user?.id
          const rank   = i + 1
          const score  = filter === 'global' ? u.avgPct : u._filtered?.pct
          const sub    = filter === 'global'
            ? `${u.gamesPlayed} partie${u.gamesPlayed !== 1 ? 's' : ''} · ${u.totalScore}/${u.totalQuestions} réponses`
            : `${u._filtered?.score}/${u._filtered?.total} bonnes réponses`

          return (
            <div key={u.id} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              background: isSelf ? '#1a2c4e' : 'var(--card)',
              border: `1.5px solid ${isSelf ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-sm)', padding: '14px 18px',
              transition: 'border-color 0.2s',
              animation: `fadeUp 0.3s ease ${i * 0.04}s both`,
            }}>
              {/* Rank */}
              <div style={{
                width: 32, textAlign: 'center', flexShrink: 0,
                fontSize: rank <= 3 ? 20 : 14,
                fontFamily: rank > 3 ? "'Space Mono', monospace" : 'inherit',
                color: rank <= 3 ? MEDAL_COLORS[rank-1] : 'var(--muted)',
                fontWeight: 700,
              }}>
                {rank <= 3 ? MEDALS[rank-1] : `#${rank}`}
              </div>

              <Avatar name={u.username} size={36} />

              {/* Name + sub */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 700, fontSize: 15,
                  color: isSelf ? 'var(--accent)' : 'var(--text)',
                }}>
                  {u.username}{isSelf ? ' · moi' : ''}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>
              </div>

              {/* Score */}
              <div style={{
                fontFamily:"'Space Mono', monospace",
                fontSize: 20, fontWeight: 700,
                color: score >= 80 ? 'var(--success)'
                     : score >= 50 ? 'var(--accent)'
                     : 'var(--danger)',
              }}>
                {score}%
              </div>
            </div>
          )
        })}
      </div>

      {/* Own position reminder when not in top */}
      {user && !displayed.find(u => u.id === user.id) && filter !== 'global' && (
        <div style={{
          marginTop: 20, padding: '14px 18px',
          background: 'var(--surface)', border: '1px dashed var(--border2)',
          borderRadius: 'var(--radius-sm)', color: 'var(--muted)', fontSize: 14,
        }}>
          Vous n'avez pas encore joué dans ce domaine.
        </div>
      )}
    </div>
  )
}

function FilterBtn({ children, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '7px 14px', borderRadius: 99,
      fontSize: 13, fontWeight: 600,
      background: active ? 'linear-gradient(135deg, var(--accent), var(--accent2))' : 'var(--card)',
      color: active ? '#fff' : 'var(--text2)',
      border: active ? '1.5px solid transparent' : '1.5px solid var(--border)',
      transition: 'all 0.18s',
    }}>
      {children}
    </button>
  )
}