// Points attribués par numéro de question (commence à 1)
// Progression exponentielle douce : Q1=10pts → Q20=500pts
export function getPoints(questionNumber) {
  const scale = [
    0,   // index 0 non utilisé
    10,  // Q1
    15,  // Q2
    20,  // Q3
    30,  // Q4
    40,  // Q5
    55,  // Q6
    70,  // Q7
    90,  // Q8
    115, // Q9
    145, // Q10
    180, // Q11
    220, // Q12
    265, // Q13
    315, // Q14
    370, // Q15
    430, // Q16
    495, // Q17
    565, // Q18
    640, // Q19
    720, // Q20
  ]
  if (questionNumber < scale.length) return scale[questionNumber]
  // Au-delà de Q20 : +100 pts par question supplémentaire
  return scale[scale.length - 1] + (questionNumber - scale.length + 1) * 100
}

// Mélange un tableau (Fisher-Yates)
export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Construit la liste de questions pour UN domaine
// Chaque question porte { question, reponses, domain }
export async function buildSingleDomainQueue(domain) {
  const data = await fetch(`/questions/${domain}.json`).then(r => r.json())
  return shuffle(data).map(q => ({ ...q, domain }))
}

// Construit la liste de questions pour TOUS les domaines
// Alterne aléatoirement les domaines, sans répéter de question
export async function buildAllDomainsQueue(domains) {
  // Charger toutes les questions de chaque domaine
  const pools = {}
  await Promise.all(
    domains.map(async d => {
      const data = await fetch(`/questions/${d}.json`).then(r => r.json())
      pools[d] = shuffle(data).map(q => ({ ...q, domain: d }))
    })
  )

  const queue = []
  // On tire question par question en choisissant un domaine aléatoire
  // parmi ceux qui ont encore des questions disponibles
  const remaining = { ...pools }

  while (true) {
    const available = Object.keys(remaining).filter(d => remaining[d].length > 0)
    if (available.length === 0) break
    // Choisir un domaine différent du précédent si possible
    const last = queue.length > 0 ? queue[queue.length - 1].domain : null
    const choices = available.length > 1
      ? available.filter(d => d !== last)
      : available
    const domain = choices[Math.floor(Math.random() * choices.length)]
    queue.push(remaining[domain].shift())
  }

  return queue
}