import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AuthScreen() {
  const { registerWithPwd, loginWithPwd } = useAuth()
  const [mode, setMode]     = useState('login')   // 'login' | 'register'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = mode === 'login'
      ? loginWithPwd(username, password)
      : registerWithPwd(username, password)

    setLoading(false)
    if (result.error) setError(result.error)
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px',
    background: 'var(--surface)',
    border: '1.5px solid var(--border2)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text)', fontSize: 15,
    outline: 'none', transition: 'border-color 0.2s',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px 16px',
      background: 'radial-gradient(ellipse at 60% 20%, #1a2545 0%, var(--bg) 65%)',
    }}>
      <div style={{ width: '100%', maxWidth: 420, animation: 'fadeUp 0.4s ease both' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 64, height: 64, borderRadius: 18,
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            fontSize: 28, marginBottom: 20,
          }}>🧠</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>QuizMaster</h1>
          <p style={{ color: 'var(--text2)', fontSize: 14 }}>
            {mode === 'login'
              ? 'Connectez-vous pour accéder au classement'
              : 'Créez votre compte et rejoignez le classement'}
          </p>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', background: 'var(--surface)',
          borderRadius: 'var(--radius-sm)', padding: 4, marginBottom: 28,
          border: '1px solid var(--border)',
        }}>
          {['login','register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError('') }}
              style={{
                flex: 1, padding: '10px', borderRadius: 6, fontSize: 14, fontWeight: 600,
                background: mode === m
                  ? 'linear-gradient(135deg, var(--accent), var(--accent2))'
                  : 'transparent',
                color: mode === m ? '#fff' : 'var(--text2)',
                transition: 'all 0.2s',
              }}>
              {m === 'login' ? 'Se connecter' : 'Créer un compte'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, color: 'var(--text2)', display:'block', marginBottom: 6, fontWeight: 600 }}>
              Pseudo
            </label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="ex: JoueurPro42"
              required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border2)'}
            />
          </div>

          <div>
            <label style={{ fontSize: 13, color: 'var(--text2)', display:'block', marginBottom: 6, fontWeight: 600 }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border2)'}
            />
          </div>

          {error && (
            <div style={{
              padding: '11px 14px', borderRadius: 'var(--radius-sm)',
              background: '#2b0e0e', border: '1px solid var(--danger)',
              color: 'var(--danger)', fontSize: 14,
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 6, padding: '14px',
              borderRadius: 'var(--radius-sm)',
              background: loading
                ? 'var(--border)'
                : 'linear-gradient(135deg, var(--accent), var(--accent2))',
              color: '#fff', fontSize: 16, fontWeight: 700,
              transition: 'all 0.2s',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? '...' : mode === 'login' ? 'Se connecter' : "Créer mon compte"}
          </button>
        </form>

        {mode === 'register' && (
          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>
            Le pseudo sera visible dans le classement public.
          </p>
        )}
      </div>
    </div>
  )
}