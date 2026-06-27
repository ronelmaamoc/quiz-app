import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthScreen from './components/AuthScreen'
import HomeScreen from './components/HomeScreen'
import QuizScreen from './components/QuizScreen'
import ResultScreen from './components/ResultScreen'
import LeaderboardScreen from './components/LeaderboardScreen'
import Navbar from './components/Navbar'
import { buildSingleDomainQueue, buildAllDomainsQueue } from './utils/quizEngine'

const DOMAINS = ['mathematiques', 'histoire', 'geographie', 'sciences', 'sport', 'informatique']

function QuizApp() {
  const { user, loading } = useAuth()
  const [screen, setScreen]       = useState('home')
  const [domains, setDomains]     = useState([])
  const [selected, setSelected]   = useState(null)   // domain name ou 'all'
  const [questions, setQuestions] = useState([])
  const [quizResult, setQuizResult] = useState(null) // { score, points, total, errors }
  const [domainsLoading, setDomainsLoading] = useState(true)

  useEffect(() => {
    Promise.all(
      DOMAINS.map(d =>
        fetch(`/questions/${d}.json`)
          .then(r => r.ok ? d : null)
          .catch(() => null)
      )
    ).then(results => {
      setDomains(results.filter(Boolean))
      setDomainsLoading(false)
    })
  }, [])

  const startQuiz = async (domainOrAll) => {
    let queue
    if (domainOrAll === 'all') {
      queue = await buildAllDomainsQueue(domains)
    } else {
      queue = await buildSingleDomainQueue(domainOrAll)
    }
    setQuestions(queue)
    setSelected(domainOrAll)
    setQuizResult(null)
    setScreen('quiz')
  }

  const endQuiz = (result) => {
    setQuizResult(result)
    setScreen('result')
  }

  if (loading || domainsLoading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh' }}>
      <div style={{
        width:44, height:44, borderRadius:'50%',
        border:'4px solid var(--border)', borderTopColor:'var(--accent)',
        animation:'spin 0.8s linear infinite',
      }} />
    </div>
  )

  if (!user) return <AuthScreen />

  return (
    <>
      <Navbar screen={screen} onNav={setScreen} />
      {screen === 'home' && (
        <HomeScreen domains={domains} onStart={startQuiz} />
      )}
      {screen === 'quiz' && (
        <QuizScreen
          questions={questions}
          domain={selected}
          onEnd={endQuiz}
        />
      )}
      {screen === 'leaderboard' && <LeaderboardScreen />}
      {screen === 'result' && quizResult && (
        <ResultScreen
          result={quizResult}
          domain={selected}
          onRestart={() => setScreen('home')}
          onSame={() => startQuiz(selected)}
          onLeaderboard={() => setScreen('leaderboard')}
        />
      )}
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <QuizApp />
    </AuthProvider>
  )
}