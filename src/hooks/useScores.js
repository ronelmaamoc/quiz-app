import { getUsers } from '../context/AuthContext'

export function useLeaderboard() {
  const users = getUsers()
  const list = Object.values(users)
    .filter(u => u.gamesPlayed > 0)
    .map(u => ({
      ...u,
      avgPct: u.totalQuestions > 0
        ? Math.round((u.totalScore / u.totalQuestions) * 100)
        : 0,
    }))
    .sort((a, b) => b.avgPct - a.avgPct || b.gamesPlayed - a.gamesPlayed)

  return list
}