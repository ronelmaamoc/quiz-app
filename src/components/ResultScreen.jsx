import { useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

function getRank(pct) {
  if (pct >= 90) return { label:'Expert !',      emoji:'🏆', color:'var(--gold)' }
  if (pct >= 70) return { label:'Très bien !',   emoji:'🎯', color:'var(--success)' }
  if (pct >= 50) return { label:'Pas mal !',     emoji:'👍', color:'var(--accent)' }
  return              { label:'À revoir...',     emoji:'📚', color:'var(--danger)' }
}

const DOMAIN_COLORS = {
  mathematiques: '#4f8ef7',
  histoire:      '#f59e0b',
  geographie:    '#22c55e',
  sciences:      '#a78bfa',
}

export default function ResultScreen({ result, domain, onRestart, onSame, onLeaderboard }) {
  const { user, updateScore } = useAuth()
  const saved = useRef(false)

  const { score, points, total, errors, stopped, history } = result
  const pct  = total > 0 ? Math.round((score / total) * 100) : 0
  const rank = getRank(pct)

  useEffect(() => {
    if (!saved.current) {
      saved.current = true
      updateScore(domain, score, total, points)
    }
  }, [])  // eslint-disable-line

  return (
    <div style={{
      minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', padding:'80px 20px 40px',
    }}>
      <div style={{ width:'100%', maxWidth:580, animation:'fadeUp 0.4s ease' }}>

        {/* Titre */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontSize:60, marginBottom:10 }}>{rank.emoji}</div>
          <h2 style={{ fontSize:28, fontWeight:900, color:rank.color, marginBottom:6 }}>
            {rank.label}
          </h2>
          {stopped && (
            <div style={{
              display:'inline-block', padding:'5px 14px',
              background:'#2b0e0e', border:'1px solid var(--danger)',
              borderRadius:99, color:'var(--danger)', fontSize:13, fontWeight:600,
            }}>
              Partie arrêtée — 5 erreurs atteintes
            </div>
          )}
        </div>

        {/* Score cards */}
        <div style={{
          display:'grid', gridTemplateColumns:'repeat(2,1fr)',
          gap:12, marginBottom:24,
        }}>
          <ScoreCard label="Score" value={`${score} / ${total}`}     icon="✅" color="var(--success)" />
          <ScoreCard label="Points"  value={`⭐ ${points.toLocaleString()}`} icon="⭐" color="var(--gold)" />
          <ScoreCard label="Taux de réussite" value={`${pct}%`}    icon="📊" color={rank.color} />
          <ScoreCard label="Erreurs" value={`${errors} / 5`}        icon="❌" color="var(--danger)" />
        </div>

        {/* Résumé question par question */}
        <div style={{
          background:'var(--card)', border:'1.5px solid var(--border)',
          borderRadius:'var(--radius)', overflow:'hidden', marginBottom:24,
        }}>
          <div style={{
            padding:'14px 18px', borderBottom:'1px solid var(--border)',
            fontWeight:700, fontSize:14, display:'flex',
            justifyContent:'space-between', alignItems:'center',
          }}>
            <span>Récapitulatif</span>
            <span style={{ fontSize:12, color:'var(--muted)',
              fontFamily:"'Space Mono',monospace" }}>
              {history.length} question{history.length > 1 ? 's' : ''}
            </span>
          </div>

          <div style={{ maxHeight:320, overflowY:'auto' }}>
            {history.map((h, i) => {
              const dc = DOMAIN_COLORS[h.domain] || 'var(--accent)'
              return (
                <div key={i} style={{
                  padding:'12px 18px',
                  borderBottom: i < history.length - 1 ? '1px solid var(--border)' : 'none',
                  display:'flex', gap:12, alignItems:'flex-start',
                }}>
                  {/* Icône résultat */}
                  <div style={{
                    width:26, height:26, borderRadius:'50%', flexShrink:0,
                    background: h.isCorrect ? '#0d2b18' : '#2b0e0e',
                    border:`1.5px solid ${h.isCorrect ? 'var(--success)' : 'var(--danger)'}`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:12, color: h.isCorrect ? 'var(--success)' : 'var(--danger)',
                  }}>
                    {h.isCorrect ? '✓' : '✗'}
                  </div>

                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, marginBottom:3,
                      whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                      Q{h.qNumber} — {h.question}
                    </div>
                    {!h.isCorrect && (
                      <div style={{ fontSize:12, color:'var(--success)' }}>
                        ✓ {h.correctAnswer}
                      </div>
                    )}
                    <div style={{
                      marginTop:4, display:'flex', gap:8, alignItems:'center', flexWrap:'wrap',
                    }}>
                      <span style={{
                        fontSize:11, background:dc+'22', color:dc,
                        borderRadius:99, padding:'2px 8px', fontWeight:600,
                      }}>
                        {h.domain}
                      </span>
                      <span style={{
                        fontSize:11, color: h.isCorrect ? 'var(--gold)' : 'var(--muted)',
                        fontFamily:"'Space Mono',monospace",
                      }}>
                        {h.isCorrect ? `+${h.points} pts` : '0 pt'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          <button onClick={onLeaderboard} style={{
            padding:'14px', borderRadius:'var(--radius)',
            background:'linear-gradient(135deg, var(--gold), #d97706)',
            color:'#000', fontSize:15, fontWeight:800,
          }}>
            🏆 Voir le classement
          </button>
          <button onClick={onSame} style={{
            padding:'14px', borderRadius:'var(--radius)',
            background:'linear-gradient(135deg, var(--accent), var(--accent2))',
            color:'#fff', fontSize:15, fontWeight:700,
          }}>
            Rejouer
          </button>
          <button onClick={onRestart} style={{
            padding:'14px', borderRadius:'var(--radius)',
            background:'var(--card)', border:'1.5px solid var(--border)',
            color:'var(--text)', fontSize:15, fontWeight:600,
          }}>
            Choisir un autre domaine
          </button>
        </div>
      </div>
    </div>
  )
}

function ScoreCard({ label, value, icon, color }) {
  return (
    <div style={{
      background:'var(--surface)', border:'1.5px solid var(--border)',
      borderRadius:'var(--radius-sm)', padding:'16px',
      textAlign:'center',
    }}>
      <div style={{ fontSize:22, marginBottom:6 }}>{icon}</div>
      <div style={{ fontSize:20, fontWeight:900, color, marginBottom:4 }}>{value}</div>
      <div style={{ fontSize:12, color:'var(--muted)' }}>{label}</div>
    </div>
  )
}