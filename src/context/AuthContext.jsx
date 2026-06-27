import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)
const USERS_KEY   = 'quiz_users'
const SESSION_KEY = 'quiz_session'

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || {} }
  catch { return {} }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY)
    if (session) {
      const users = getUsers()
      if (users[session]) setUser(users[session])
    }
    setLoading(false)
  }, [])

  const registerWithPwd = (username, password) => {
    const users = getUsers()
    if (!username.trim() || username.trim().length < 3)
      return { error: 'Le pseudo doit contenir au moins 3 caractères.' }
    if (!password || password.length < 4)
      return { error: 'Le mot de passe doit contenir au moins 4 caractères.' }
    const key = username.trim().toLowerCase()
    if (users[key]) return { error: 'Ce pseudo est déjà pris.' }

    const newUser = {
      id: key, username: username.trim(),
      createdAt: Date.now(),
      totalScore: 0, totalQuestions: 0,
      totalPoints: 0, gamesPlayed: 0,
      bestByDomain: {},
    }
    users[key] = newUser
    saveUsers(users)
    localStorage.setItem(`quiz_pwd_${key}`, password)
    localStorage.setItem(SESSION_KEY, key)
    setUser(newUser)
    return { success: true }
  }

  const loginWithPwd = (username, password) => {
    const users = getUsers()
    const key   = username.trim().toLowerCase()
    if (!users[key]) return { error: 'Pseudo introuvable.' }
    const storedPwd = localStorage.getItem(`quiz_pwd_${key}`)
    if (storedPwd !== password) return { error: 'Mot de passe incorrect.' }
    localStorage.setItem(SESSION_KEY, key)
    setUser(users[key])
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  // points : nouveau paramètre
  const updateScore = (domain, score, total, points = 0) => {
    const users = getUsers()
    const u = users[user.id]
    if (!u) return

    u.totalScore     = (u.totalScore || 0) + score
    u.totalQuestions = (u.totalQuestions || 0) + total
    u.totalPoints    = (u.totalPoints || 0) + points
    u.gamesPlayed    = (u.gamesPlayed || 0) + 1

    if (!u.bestByDomain) u.bestByDomain = {}
    const pct  = total > 0 ? Math.round((score / total) * 100) : 0
    const prev = u.bestByDomain[domain]
    if (!prev || points > (prev.points || 0)) {
      u.bestByDomain[domain] = { score, total, pct, points, date: Date.now() }
    }

    users[u.id] = u
    saveUsers(users)
    setUser({ ...u })
  }

  return (
    <AuthContext.Provider value={{ user, loading, registerWithPwd, loginWithPwd, logout, updateScore }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export { getUsers }