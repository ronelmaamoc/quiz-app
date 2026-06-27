import { useState, useEffect, useRef, useCallback } from 'react'
import ProgressBar from './ProgressBar'
import { getPoints, shuffle } from '../utils/quizEngine'

const MAX_ERRORS   = 5
const NEXT_DELAY   = 2000   // ms avant passage automatique

const DOMAIN_COLORS = {
  mathematiques: '#4f8ef7',
  histoire:      '#f59e0b',
  geographie:    '#22c55e',
  sciences:      '#a78bfa',
}

export default function QuizScreen({ questions, domain, onEnd }) {
  const [idx, setIdx]           = useState(0)
  const [choices, setChoices]   = useState([])
  const [selected, setSelected] = useState(null)   // index dans choices
  const [errors, setErrors]     = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [countdown, setCountdown]   = useState(null) // secondes restantes
  const [anim, setAnim]         = useState(false)
  const [history, setHistory]   = useState([])     // résumé des réponses

  const timerRef    = useRef(null)
  const countRef    = useRef(null)

  const q       = questions[idx]
  const correct = q ? choices.indexOf(q.reponses[0]) : -1
  const qNumber = idx + 1   // numéro humain (commence à 1)
  const pts     = getPoints(qNumber)

  // Prépare les choix à chaque nouvelle question
  useEffect(() => {
    if (!q) return
    setChoices(shuffle(q.reponses))
    setSelected(null)
    setCountdown(null)
    setAnim(false)
    clearTimeout(timerRef.current)
    clearInterval(countRef.current)
    setTimeout(() => setAnim(true), 10)
  }, [idx])   // eslint-disable-line

  // Nettoyage à la destruction
  useEffect(() => () => {
    clearTimeout(timerRef.current)
    clearInterval(countRef.current)
  }, [])

  const goNext = useCallback((newErrors, newPoints, newCorrect, newHistory) => {
    clearTimeout(timerRef.current)
    clearInterval(countRef.current)

    const nextIdx  = idx + 1
    const allDone  = nextIdx >= questions.length
    const tooMany  = newErrors >= MAX_ERRORS

    if (allDone || tooMany) {
      onEnd({
        score:      newCorrect,
        points:     newPoints,
        total:      nextIdx,
        errors:     newErrors,
        stopped:    tooMany && !allDone,
        history:    newHistory,
      })
    } else {
      setIdx(nextIdx)
    }
  }, [idx, questions.length, onEnd])

  const handleSelect = (i) => {
    if (selected !== null) return   // déjà répondu
    setSelected(i)

    const isCorrect = i === correct
    const newErrors  = isCorrect ? errors : errors + 1
    const earned     = isCorrect ? pts : 0
    const newPoints  = totalPoints + earned
    const newCorrect = correctCount + (isCorrect ? 1 : 0)
    const newHistory = [
      ...history,
      {
        question:     q.question,
        domain:       q.domain,
        userAnswer:   choices[i],
        correctAnswer: q.reponses[0],
        isCorrect,
        points:       earned,
        qNumber,
      }
    ]

    if (!isCorrect) setErrors(newErrors)
    setTotalPoints(newPoints)
    setCorrectCount(newCorrect)
    setHistory(newHistory)

    // Countdown 5s puis passage auto
    setCountdown(5)
    countRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(countRef.current); return 0 }
        return c - 1
      })
    }, 1000)

    timerRef.current = setTimeout(() => {
      goNext(newErrors, newPoints, newCorrect, newHistory)
    }, NEXT_DELAY)
  }

  if (!q) return null

  const domColor = DOMAIN_COLORS[q.domain] || 'var(--accent)'

  return (
    <div style={{
      minHeight:'100vh', display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      padding:'80px 20px 40px',
    }}>
      <div style={{
        width:'100%', maxWidth:660,
        opacity: anim ? 1 : 0,
        transform: anim ? 'translateY(0)' : 'translateY(16px)',
        transition:'opacity 0.3s ease, transform 0.3s ease',
      }}>

        {/* Header : domaine + erreurs + points */}
        <div style={{
          display:'flex', justifyContent:'space-between',
          alignItems:'center', marginBottom:20, flexWrap:'wrap', gap:8,
        }}>
          <div style={{
            display:'flex', alignItems:'center', gap:8,
            background: domColor+'22', border:`1px solid ${domColor}44`,
            borderRadius:99, padding:'5px 14px',
            fontSize:12, fontWeight:700, color:domColor,
            fontFamily:"'Space Mono',monospace", textTransform:'uppercase',
          }}>
            {q.domain?.replace(/_/g,' ')}
          </div>

          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            {/* Erreurs */}
            <div style={{ display:'flex', gap:4 }}>
              {Array.from({ length: MAX_ERRORS }).map((_, i) => (
                <div key={i} style={{
                  width:12, height:12, borderRadius:'50%',
                  background: i < errors ? 'var(--danger)' : 'var(--border)',
                  transition:'background 0.3s',
                }} />
              ))}
            </div>
            {/* Points */}
            <div style={{
              fontFamily:"'Space Mono',monospace", fontSize:13,
              color:'var(--gold)', fontWeight:700,
            }}>
              ⭐ {totalPoints.toLocaleString()} pts
            </div>
          </div>
        </div>

        <ProgressBar current={idx + 1} total={questions.length} />

        {/* Points de cette question */}
        <div style={{
          display:'flex', justifyContent:'flex-end', marginBottom:10,
        }}>
          <span style={{
            fontSize:12, fontFamily:"'Space Mono',monospace",
            color: selected === null ? 'var(--gold)' : selected === correct ? 'var(--success)' : 'var(--muted)',
            fontWeight:700,
          }}>
            {selected === null
              ? `+${pts} pts si correct`
              : selected === correct
                ? `+${pts} pts gagnés !`
                : '0 pt'}
          </span>
        </div>

        {/* Question */}
        <div style={{
          background:'var(--card)', border:'1.5px solid var(--border)',
          borderRadius:'var(--radius)', padding:'28px 24px', marginBottom:16,
        }}>
          <div style={{ fontSize:12, color:'var(--muted)', marginBottom:10,
            fontFamily:"'Space Mono',monospace" }}>
            Q{qNumber}
          </div>
          <p style={{ fontSize:'clamp(1rem,2.5vw,1.15rem)', fontWeight:600, lineHeight:1.6 }}>
            {q.question}
          </p>
        </div>

        {/* Choix */}
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
          {choices.map((c, i) => {
            const isSelected = selected === i
            const isCorrectChoice = i === correct
            const answered = selected !== null

            let bg, border, color, icon
            if (!answered) {
              bg='var(--card)'; border='1.5px solid var(--border)'; color='var(--text)'; icon=null
            } else if (isCorrectChoice) {
              bg='#0d2b18'; border='2px solid var(--success)'; color='var(--success)'; icon='✓'
            } else if (isSelected && !isCorrectChoice) {
              bg='#2b0e0e'; border='2px solid var(--danger)'; color='var(--danger)'; icon='✗'
            } else {
              bg='var(--card)'; border='1.5px solid var(--border)'; color='var(--muted)'; icon=null
            }

            return (
              <button key={i}
                onClick={() => handleSelect(i)}
                style={{
                  padding:'14px 18px', borderRadius:'var(--radius)',
                  textAlign:'left', fontSize:15, fontWeight:500,
                  display:'flex', alignItems:'center', gap:12,
                  transition:'all 0.2s ease',
                  cursor: answered ? 'default' : 'pointer',
                  background:bg, border, color,
                  transform: !answered && isSelected ? 'scale(1.01)' : 'scale(1)',
                }}
              >
                <span style={{
                  width:28, height:28, borderRadius:'50%',
                  background:'var(--bg)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:12, flexShrink:0,
                  fontFamily:"'Space Mono',monospace", color:'inherit',
                  fontWeight:700,
                  border: answered && isCorrectChoice ? '2px solid var(--success)'
                        : answered && isSelected     ? '2px solid var(--danger)'
                        : '1px solid var(--border)',
                }}>
                  {icon || String.fromCharCode(65 + i)}
                </span>
                <span style={{ flex:1 }}>{c}</span>
                {answered && isCorrectChoice && (
                  <span style={{ fontSize:11, fontFamily:"'Space Mono',monospace",
                    color:'var(--success)', whiteSpace:'nowrap' }}>
                    Bonne réponse
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Feedback + countdown */}
        {selected !== null && (
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'12px 18px', borderRadius:'var(--radius-sm)',
            background: selected === correct ? '#0d2b18' : '#2b0e0e',
            border:`1px solid ${selected === correct ? 'var(--success)' : 'var(--danger)'}`,
          }}>
            <span style={{
              color: selected === correct ? 'var(--success)' : 'var(--danger)',
              fontSize:14, fontWeight:700,
            }}>
              {selected === correct
                ? `🎉 Correct ! +${pts} points`
                : `❌ Incorrect — ${errors}/${MAX_ERRORS} erreurs`}
            </span>

            {/* Countdown circle */}
            <CountdownCircle seconds={countdown} total={5} />
          </div>
        )}

        {/* Barre d'erreurs d'avertissement */}
        {errors >= MAX_ERRORS - 1 && selected !== null && errors < MAX_ERRORS && (
          <div style={{
            marginTop:10, padding:'10px 16px',
            borderRadius:'var(--radius-sm)',
            background:'#2b1a00', border:'1px solid var(--warning)',
            color:'var(--warning)', fontSize:13, fontWeight:600,
          }}>
            ⚠️ Encore une erreur et la partie s'arrête !
          </div>
        )}
      </div>
    </div>
  )
}

function CountdownCircle({ seconds, total }) {
  if (seconds === null) return null
  const r   = 18
  const circ = 2 * Math.PI * r
  const pct  = seconds / total
  return (
    <div style={{ position:'relative', width:44, height:44, flexShrink:0 }}>
      <svg width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={r} fill="none" stroke="var(--border)" strokeWidth="3"/>
        <circle cx="22" cy="22" r={r} fill="none"
          stroke="var(--accent)" strokeWidth="3" strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          transform="rotate(-90 22 22)"
          style={{ transition:'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <div style={{
        position:'absolute', inset:0, display:'flex',
        alignItems:'center', justifyContent:'center',
        fontSize:13, fontWeight:700, color:'var(--accent)',
        fontFamily:"'Space Mono',monospace",
      }}>
        {seconds}
      </div>
    </div>
  )
}