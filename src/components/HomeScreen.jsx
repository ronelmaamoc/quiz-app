import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const ICONS = {
  mathematiques: '∑',
  histoire:      '⏳',
  geographie:    '🌍',
  sciences:      '⚗️',
  all:           '🎲',
}

const COLORS = {
  mathematiques: ['#4f8ef7','#1d3a7a'],
  histoire:      ['#f59e0b','#7c4a00'],
  geographie:    ['#22c55e','#064e22'],
  sciences:      ['#a78bfa','#3b1a78'],
  all:           ['#f43f5e','#7c0d21'],
}

function label(d) {
  if (d === 'all') return 'Tous les domaines'
  return d.charAt(0).toUpperCase() + d.slice(1).replace(/_/g,' ')
}

function StatCard({ label, value, icon }) {
  return (
    <div style={{
      background:'var(--card)', border:'1.5px solid var(--border)',
      borderRadius:'var(--radius-sm)', padding:'14px 18px',
      display:'flex', alignItems:'center', gap:12,
    }}>
      <span style={{ fontSize:22 }}>{icon}</span>
      <div>
        <div style={{ fontSize:18, fontWeight:800, color:'var(--text)' }}>{value}</div>
        <div style={{ fontSize:12, color:'var(--muted)' }}>{label}</div>
      </div>
    </div>
  )
}

export default function HomeScreen({ domains, onStart }) {
  const { user } = useAuth()
  const [hovered, setHovered] = useState(null)

  const globalAvg = user && user.totalQuestions > 0
    ? Math.round((user.totalScore / user.totalQuestions) * 100)
    : null

  // Liste : "all" en premier, puis les domaines
  const cards = ['all', ...domains]

  return (
    <div style={{
      minHeight:'100vh',
      display:'flex', flexDirection:'column',
      alignItems:'center', padding:'80px 20px 40px',
    }}>
      {/* Stats utilisateur */}
      {user && (
        <div style={{
          width:'100%', maxWidth:820, marginBottom:36,
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))',
          gap:12,
        }}>
          <StatCard label="Parties jouées"    value={user.gamesPlayed || 0}            icon="🎮" />
          <StatCard label="Taux de réussite"  value={globalAvg !== null ? `${globalAvg}%` : '—'} icon="📊" />
          <StatCard label="Points totaux"     value={(user.totalPoints || 0).toLocaleString()} icon="⭐" />
          <StatCard label="Domaines joués"    value={Object.keys(user.bestByDomain || {}).length} icon="📚" />
        </div>
      )}

      {/* Titre */}
      <div style={{ textAlign:'center', marginBottom:40, width:'100%', maxWidth:820 }}>
        <h1 style={{
          fontSize:'clamp(1.8rem, 5vw, 3rem)', fontWeight:900, lineHeight:1.15,
          background:'linear-gradient(135deg, var(--text) 30%, var(--accent2))',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
          marginBottom:10,
        }}>
          Choisissez votre domaine
        </h1>
        <p style={{ color:'var(--text2)', fontSize:15 }}>
          Bonjour <strong style={{ color:'var(--accent)' }}>{user?.username}</strong> !
          La partie s'arrête après <strong style={{ color:'var(--danger)' }}>5 erreurs</strong> ou quand toutes les questions ont été posées.
        </p>
      </div>

      {/* Grille des domaines */}
      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',
        gap:16, width:'100%', maxWidth:820,
      }}>
        {cards.map(d => {
          const [c1, c2] = COLORS[d] || ['#4f8ef7','#1d3a7a']
          const isHov    = hovered === d
          const best     = d !== 'all' ? user?.bestByDomain?.[d] : null
          const isAll    = d === 'all'

          return (
            <button key={d}
              onClick={() => onStart(d)}
              onMouseEnter={() => setHovered(d)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: isHov
                  ? `linear-gradient(135deg, ${c2}cc, ${c2}55)`
                  : isAll ? `linear-gradient(135deg, ${c2}44, var(--card))` : 'var(--card)',
                border:`1.5px solid ${isHov ? c1 : isAll ? c1+'66' : 'var(--border)'}`,
                borderRadius:'var(--radius)', padding:'26px 22px',
                textAlign:'left', transition:'all 0.22s ease',
                transform: isHov ? 'translateY(-3px)' : 'none',
                boxShadow: isHov ? `0 8px 32px ${c1}33` : 'none',
                cursor:'pointer', position:'relative',
                gridColumn: isAll ? '1 / -1' : 'auto',  // "Tous" prend toute la largeur
              }}
            >
              {best && (
                <div style={{
                  position:'absolute', top:12, right:12,
                  background: c1+'22', borderRadius:99, padding:'3px 10px',
                  fontSize:11, color:c1, fontWeight:700,
                  fontFamily:"'Space Mono',monospace",
                }}>
                  Meilleur : {best.pct}%
                </div>
              )}

              <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ fontSize: isAll ? 40 : 34 }}>{ICONS[d] || '📚'}</div>
                <div>
                  <div style={{
                    fontSize: isAll ? 20 : 17, fontWeight:700,
                    color: isHov ? c1 : 'var(--text)', marginBottom:4,
                  }}>
                    {label(d)}
                  </div>
                  <div style={{ fontSize:13, color:'var(--muted)' }}>
                    {isAll
                      ? 'Questions piochées aléatoirement dans tous les domaines'
                      : 'Questions à choix multiples'}
                  </div>
                </div>
              </div>

              <div style={{
                marginTop:14, fontSize:12,
                fontFamily:"'Space Mono',monospace",
                color: isHov ? c1 : 'var(--muted)',
              }}>
                JOUER →
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}