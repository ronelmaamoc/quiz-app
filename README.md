# 🎯 Quiz App - Application de Quiz Interactive

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.0-61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)](https://tailwindcss.com/)

Une application web moderne de quiz développée avec React, Vite et Tailwind CSS. Testez vos connaissances dans 6 domaines différents avec plus de 1000 questions interactives !

<p align="center">
  <img src="public/favicon.svg" alt="Quiz App Logo" width="120">
</p>

## ✨ Démo

<!-- Ajoutez un lien vers votre démo ici si hébergée -->
🔗 **Live Demo**: https://quizz-games.netlify.app/

## 📋 Table des matières

- [Fonctionnalités](#-fonctionnalités)
- [Technologies utilisées](#-technologies-utilisées)
- [Structure du projet](#-structure-du-projet)
- [Installation](#-installation)
- [Utilisation](#-utilisation)
- [Format des questions](#-format-des-questions)
- [Captures d'écran](#-captures-décran)
- [Contribution](#-contribution)
- [Auteur](#-auteur)
- [Licence](#-licence)

## ✨ Fonctionnalités

### 🎮 Expérience utilisateur
- **Multi-domaines** : 6 catégories disponibles (Mathématiques, Sciences, Informatique, Histoire, Géographie, Sport)
- **Questions aléatoires** : Les questions et les réponses sont mélangées à chaque session
- **Interface intuitive** : Design moderne et épuré avec animations fluides
- **Système de score** : Suivi en temps réel des bonnes réponses

### 👤 Gestion utilisateur
- **Authentification simple** : Connexion rapide avec un pseudo
- **Historique des scores** : Conservation des résultats par utilisateur
- **Classement** : Tableau des meilleurs scores de tous les joueurs

### 📊 Statistiques
- **Barre de progression** : Visualisation de l'avancement dans le quiz
- **Score en direct** : Affichage du score pendant le quiz
- **Résultats détaillés** : Pourcentage de réussite et message personnalisé

### 🎨 Design
- **Responsive** : Adapté à tous les écrans (mobile, tablette, desktop)
- **Thème clair/sombre** : Interface agréable pour tous les goûts
- **Animations** : Transitions fluides pour une meilleure expérience

## 🛠️ Technologies utilisées

| Technologie | Version | Utilisation |
|------------|---------|-------------|
| React | 18.x | Bibliothèque UI principale |
| Vite | 5.x | Build tool et dev server |
| Tailwind CSS | 3.x | Framework CSS |
| React Router DOM | 6.x | Gestion des routes |
| Context API | - | Gestion d'état global |

## 📁 Structure du projet

```
quiz-app/
├── 📁 public/
│   ├── 📁 questions/          # 📚 Fichiers JSON des questions
│   │   ├── mathematiques.json # 400+ questions
│   │   ├── sciences.json      # 1000+ questions
│   │   ├── informatique.json  # 1000+ questions
│   │   ├── histoire.json      # Questions d'histoire
│   │   ├── geographie.json    # Questions de géographie
│   │   └── sport.json         # Questions de sport
│   ├── favicon.svg            # Icône du site
│   └── icons.svg              # Icônes SVG
├── 📁 src/
│   ├── 📁 components/         # ⚛️ Composants React
│   │   ├── AuthScreen.jsx     # Écran de connexion
│   │   ├── HomeScreen.jsx     # Écran d'accueil
│   │   ├── QuizScreen.jsx     # Écran de quiz
│   │   ├── ResultScreen.jsx   # Écran des résultats
│   │   ├── LeaderboardScreen.jsx # Classement
│   │   ├── Navbar.jsx         # Barre de navigation
│   │   └── ProgressBar.jsx    # Barre de progression
│   ├── 📁 context/            # 🗂️ Contextes React
│   │   └── AuthContext.jsx    # Gestion de l'authentification
│   ├── 📁 hooks/              # 🎣 Hooks personnalisés
│   │   └── useScores.js       # Gestion des scores
│   ├── 📁 utils/              # 🛠️ Utilitaires
│   │   └── quizEngine.js      # Logique du quiz
│   ├── 📁 assets/             # 🖼️ Ressources
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── App.jsx                # Composant principal
│   ├── App.css                # Styles personnalisés
│   ├── index.css              # Styles globaux
│   └── main.jsx               # Point d'entrée
├── index.html                 # Page HTML
├── package.json               # Dépendances et scripts
├── vite.config.js             # Configuration Vite
├── tailwind.config.js         # Configuration Tailwind
├── postcss.config.js          # Configuration PostCSS
└── README.md                  # Documentation
```

## 📦 Installation

```bash
# 1. Cloner le projet
git clone https://github.com/ronelmaamoc/quiz-app.git

# 2. Se rendre dans le dossier
cd quiz-app

# 3. Installer les dépendances
npm install

# 4. Lancer l'application en mode développement
npm run dev

# 5. Ouvrir dans le navigateur
# http://localhost:5173

# 6. Construire pour la production
npm run build

# 7. Prévisualiser la version de production
npm run preview
```

## 🚀 Utilisation

### 1. Connexion
- Entrez un pseudo de votre choix
- Cliquez sur "Commencer"

### 2. Sélection du quiz
- Choisissez un domaine parmi les 6 disponibles
- Chaque domaine contient des centaines de questions

### 3. Répondre aux questions
- Une question s'affiche avec 4 propositions
- Cliquez sur la réponse de votre choix
- La barre de progression montre votre avancement
- Votre score est mis à jour en temps réel

### 4. Résultats
- À la fin du quiz, consultez votre score
- Recevez un message personnalisé selon votre performance
- Visualisez votre pourcentage de réussite

### 5. Classement
- Consultez les meilleurs scores de tous les joueurs
- Essayez de battre le record !

## 📝 Format des questions

Les fichiers de questions sont au format JSON avec la structure suivante :

```json
[
  {
    "question": "Quelle est la formule chimique de l'eau ?",
    "reponses": ["H₂O", "CO₂", "O₂", "H₂O₂"]
  },
  {
    "question": "Combien d'os possède le corps humain adulte ?",
    "reponses": ["206", "208", "200", "212"]
  }
]
```

> **Note importante** : 
> - La première réponse (index 0) est **toujours** la bonne réponse
> - Les réponses sont automatiquement mélangées à l'affichage
> - Les questions sont également mélangées aléatoirement

### Ajouter un nouveau quiz

1. Créez un fichier JSON dans `public/questions/`
2. Respectez le format mentionné ci-dessus
3. Le fichier apparaîtra automatiquement dans la sélection des quiz
4. Le nom du fichier (sans l'extension) servira de titre pour le quiz

## 🔧 Configuration avancée

### Personnalisation des styles

Les styles sont configurés via plusieurs fichiers :

- `tailwind.config.js` : Configuration Tailwind CSS
- `src/index.css` : Styles globaux et variables
- `src/App.css` : Styles spécifiques à l'application

### Modification des thèmes

Pour changer les couleurs principales, modifiez dans `tailwind.config.js` :

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
      secondary: '#your-color',
    }
  }
}
```

## 📱 Compatibilité

| Navigateur | Version | Support |
|------------|---------|---------|
| Chrome | ≥ 90 | ✅ |
| Firefox | ≥ 88 | ✅ |
| Safari | ≥ 14 | ✅ |
| Edge | ≥ 90 | ✅ |
| Mobile | - | ✅ Responsive |

## 🤝 Contribution

Les contributions sont les bienvenues ! Voici comment contribuer :

1. **Fork** le projet
2. **Créez votre branche** (`git checkout -b feature/AmazingFeature`)
3. **Commitez vos changements** (`git commit -m 'Add some AmazingFeature'`)
4. **Poussez vers la branche** (`git push origin feature/AmazingFeature`)
5. **Ouvrez une Pull Request**

### Règles de contribution

- Respectez le style de code existant
- Ajoutez des commentaires si nécessaire
- Testez vos changements
- Mettez à jour la documentation si besoin

## 👤 Auteur

**MAAMOC KENGUIM RONEL**

<p align="center">
  <a href="https://github.com/ronelmaamoc">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="mailto:ronelmaamoc52@gmail.com">
    <img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Gmail">
  </a>
</p>

- **GitHub**: [@ronelmaamoc](https://github.com/ronelmaamoc)
- **Email**: ronelmaamoc52@gmail.com
- **Projet**: [quiz-app](https://github.com/ronelmaamoc/quiz-app)

## 🙏 Remerciements

Un grand merci à :

- [React](https://reactjs.org/) pour l'excellente bibliothèque UI
- [Vite](https://vitejs.dev/) pour la rapidité de développement
- [Tailwind CSS](https://tailwindcss.com/) pour le design facilité
- Tous les contributeurs de projets open source
- La communauté pour leur soutien

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus d'informations.

```
MIT License

Copyright (c) 2024 MAAMOC KENGUIM RONEL

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🎯 Feuille de route

- [x] Système d'authentification
- [x] Multi-domaines de quiz
- [x] Classement des scores
- [x] Interface responsive
- [ ] Mode chronométré
- [ ] Questions personnalisées
- [ ] Mode multijoueur
- [ ] Statistiques détaillées
- [ ] Export des résultats en PDF
- [ ] Thème sombre amélioré
- [ ] Intégration de l'IA pour générer des questions
- [ ] Version mobile native avec React Native

## 📊 Statistiques du projet

| Domaine | Nombre de questions |
|---------|-------------------|
| Mathématiques | 400+ |
| Sciences | 1000+ |
| Informatique | 1000+ |
| Histoire | 50+ |
| Géographie | 50+ |
| Sport | 50+ |
| **Total** | **2550+** |

## ⭐ Support

Si vous aimez ce projet, n'oubliez pas de ⭐ le projet sur GitHub !
