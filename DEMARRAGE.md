# 🚀 Démarrage Rapide

## Installation en 4 étapes

### 1️⃣ Installation des dépendances
```bash
npm install
```

### 2️⃣ Configuration de la base de données
```bash
npm run db:push
```

### 3️⃣ Ajout des données de démonstration
```bash
npm run db:seed
```

### 4️⃣ Lancement du serveur
```bash
npm run dev
```

## ✅ Accès

- **Site public** : http://localhost:3000
- **Administration** : http://localhost:3000/admin/login

### Identifiants par défaut
- Email : `admin@portfolio.com`
- Mot de passe : `Admin123!`

## 📋 Checklist Post-Installation

- [ ] Connectez-vous au back-office
- [ ] Modifiez le contenu de la page d'accueil
- [ ] Créez votre premier article
- [ ] Ajoutez vos prestations
- [ ] Listez vos expériences
- [ ] Changez les identifiants admin dans `.env`
- [ ] Personnalisez les données de démonstration

## 🎯 Prochaines Étapes

1. **Personnalisez le contenu** via l'admin
2. **Supprimez les données de démo** et ajoutez vos vraies données
3. **Testez sur mobile/tablette** pour vérifier le responsive
4. **Préparez le déploiement** en production

## 📚 Documentation

- `README.md` - Documentation technique complète
- `GUIDE_ADMIN.md` - Guide d'utilisation du CMS

## 🆘 Problèmes Courants

### La base de données ne se crée pas
```bash
rm -f prisma/dev.db
npm run db:push
npm run db:seed
```

### Erreur de connexion admin
Vérifiez que le seed a bien fonctionné :
```bash
npm run db:seed
```

### Le site ne démarre pas
Vérifiez les dépendances :
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**Bon développement ! 🎉**