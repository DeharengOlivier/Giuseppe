# Portfolio Professionnel avec CMS Intégré

Une application web complète de portfolio avec un système de gestion de contenu (CMS) intégré, construite avec Next.js 15, TypeScript, Prisma et NextAuth.

## 🚀 Fonctionnalités

### Pages Publiques
- **Page d'accueil** : Hero section personnalisable, derniers articles, aperçu des prestations
- **Page Prestations** : Liste complète des services avec descriptions, prix et bénéfices
- **Page Articles** : Blog avec liste d'articles et pages individuelles
- **Page Expériences** : Timeline professionnelle interactive

### Back-Office (CMS)
- ✅ Authentification sécurisée avec NextAuth
- ✅ Gestion complète des articles (création, édition, suppression, publication)
- ✅ Éditeur de texte riche (TipTap)
- ✅ Gestion des prestations
- ✅ Gestion des expériences professionnelles
- ✅ Modification du contenu des pages (titres, textes, boutons)
- ✅ **Analytics en temps réel** : Tracking des visites avec géolocalisation
- ✅ Interface moderne et intuitive

### Analytics Avancés (NoSQL)
- 📊 Tracking automatique de toutes les visites
- 🌍 Géolocalisation par IP (pays, ville, coordonnées GPS)
- 📈 Statistiques en temps réel (24h, 7 jours, total)
- 📉 Graphiques par pays et par page
- 🔍 Filtres avancés et liste détaillée des visites
- 💾 Stockage dans MongoDB (base de données orientée document)

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn
- MongoDB 7.0+ (pour les analytics)

### Installation rapide

```bash
# Installation des dépendances
npm install

# Installation de MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb/brew/mongodb-community@7.0

# Configuration de la base de données SQLite (contenu)
npm run db:push

# Peuplement avec des données de démonstration
npm run db:seed

# Lancement avec le script automatique (recommandé)
./start.sh

# OU lancement manuel
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

> 📝 Pour l'installation de MongoDB sur d'autres systèmes, consultez [MONGODB_SETUP.md](./MONGODB_SETUP.md)

## 🔐 Connexion au Back-Office

Accédez au back-office sur : [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Identifiants par défaut :**
- Email : `admin@portfolio.com`
- Mot de passe : `Admin123!`

⚠️ **Important** : Changez ces identifiants en production en modifiant le fichier `.env`

## 🗂️ Structure du Projet

```
/app
  /admin                    # Back-office CMS
    /(protected)            # Pages protégées par auth
      /articles            # Gestion des articles
      /prestations         # Gestion des prestations
      /experiences         # Gestion des expériences
      /page-content        # Gestion du contenu des pages
      /analytics           # 📊 Dashboard Analytics
    /components            # Composants admin
    /login                 # Page de connexion
  /articles                # Pages publiques articles
  /prestations             # Page publiques prestations
  /experiences             # Page publique expériences
  /api                     # Routes API
    /articles              # CRUD articles
    /prestations           # CRUD prestations
    /experiences           # CRUD expériences
    /page-content          # Gestion contenu
    /analytics             # 📊 API Analytics & stats
    /auth                  # Authentification NextAuth
  /components              # Composants publics
/prisma
  schema.prisma            # Schéma de base de données (SQLite)
  seed.ts                  # Données de démonstration
/lib
  prisma.ts                # Client Prisma (SQLite)
  mongodb.ts               # 📊 Client MongoDB (Analytics)
```

## 📝 Utilisation du CMS

### Gestion des Articles
1. Connectez-vous au back-office
2. Cliquez sur "Articles" dans le menu
3. Créez un nouvel article avec le bouton "+ Nouvel article"
4. Rédigez votre contenu avec l'éditeur riche
5. Cochez "Publier cet article" pour le rendre visible
6. Le slug est généré automatiquement depuis le titre

### Gestion des Prestations
1. Allez dans "Prestations"
2. Créez une nouvelle prestation
3. Ajoutez titre, description, prix (optionnel)
4. Listez les bénéfices principaux
5. Définissez l'ordre d'affichage

### Gestion des Expériences
1. Accédez à "Expériences"
2. Ajoutez vos expériences professionnelles
3. Renseignez poste, entreprise, dates, description
4. Listez les compétences clés
5. Cochez "Poste actuel" si pertinent

### Modification du Contenu des Pages
1. Cliquez sur "Contenu des pages"
2. Modifiez les textes du hero, sections, boutons
3. Les changements sont immédiats après sauvegarde

### 📊 Analytics - Suivi des Visites
1. Accédez à "Analytics" dans le menu admin
2. Consultez les statistiques en temps réel :
   - Visites des 24 dernières heures
   - Visites des 7 derniers jours
   - Total de visites
   - Top 10 des pays
   - Top 10 des pages visitées
   - Graphique par jour
3. Utilisez les filtres pour analyser par page ou par pays
4. Consultez la liste détaillée avec IP, localisation, navigateur

**Fonctionnement :**
- Le tracking est automatique sur toutes les pages publiques
- Chaque visite enregistre : IP, page, pays, ville, coordonnées GPS, timezone, user agent, referer
- Les données sont stockées dans MongoDB (NoSQL orienté document)
- Aucune limitation de tracking (tous les visiteurs sont enregistrés)
- Les pages admin ne sont pas trackées

## 🛠️ Technologies Utilisées

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript
- **Base de données contenu** : SQLite (via Prisma ORM)
- **Base de données analytics** : MongoDB 7.0 (NoSQL)
- **Authentification** : NextAuth.js v5
- **Éditeur riche** : TipTap
- **Styling** : Tailwind CSS
- **Icônes** : Lucide React
- **Dates** : date-fns
- **Géolocalisation** : geoip-lite

## 🔧 Scripts Disponibles

```bash
npm run dev          # Démarre le serveur de développement
npm run build        # Compile l'application pour production
npm run start        # Lance l'application en production
npm run lint         # Vérifie le code avec ESLint
npm run db:generate  # Génère le client Prisma
npm run db:push      # Met à jour la base de données
npm run db:seed      # Peuple la base avec des données de démo
npm run db:studio    # Ouvre Prisma Studio (interface de BDD)
```

## 🌐 Déploiement

### Avant le déploiement
1. Changez les identifiants admin dans `.env`
2. Modifiez `NEXTAUTH_SECRET` avec une valeur sécurisée
3. Configurez `NEXTAUTH_URL` avec votre URL de production

### Sur Vercel
```bash
npm run build        # Teste la compilation
```

Puis déployez sur Vercel en configurant les variables d'environnement.

## 📄 Variables d'Environnement

Créez un fichier `.env` avec :

```env
# SQLite pour le contenu (articles, prestations, etc.)
DATABASE_URL="file:./dev.db"

# MongoDB pour les analytics
MONGODB_URI="mongodb://localhost:27017/portfolio_analytics"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-secret-tres-secure"

# Admin par défaut
ADMIN_EMAIL="admin@portfolio.com"
ADMIN_PASSWORD="Admin123!"
```
ADMIN_EMAIL="votre@email.com"
ADMIN_PASSWORD="VotreMotDePasse123!"
```

## ✨ Personnalisation

### Modifier les couleurs
Éditez `tailwind.config.js` et ajustez la palette de couleurs.

### Ajouter des sections
Créez de nouveaux modèles dans `prisma/schema.prisma` et ajoutez les routes API correspondantes.

### Personnaliser le design
Modifiez les composants dans `/app/components/` et les pages dans `/app/`.

## 📞 Support

Pour toute question ou problème, consultez la documentation de :
- [Next.js](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📜 Licence

Ce projet est open source et disponible sous la licence MIT.

---

**Développé avec ❤️ par GitHub Copilot**
