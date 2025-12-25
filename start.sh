#!/bin/bash

echo "🚀 Démarrage du Portfolio avec Analytics..."
echo ""

# Vérifier si MongoDB est en cours d'exécution
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB n'est pas en cours d'exécution."
    echo "Démarrage de MongoDB..."
    brew services start mongodb/brew/mongodb-community@7.0
    sleep 2
else
    echo "✅ MongoDB est déjà en cours d'exécution"
fi

# Vérifier la connexion MongoDB
echo "🔍 Vérification de la connexion MongoDB..."
if mongosh --quiet --eval "db.runCommand({ ping: 1 })" > /dev/null 2>&1; then
    echo "✅ MongoDB est accessible"
else
    echo "❌ Impossible de se connecter à MongoDB"
    echo "Veuillez installer MongoDB avec: brew install mongodb-community@7.0"
    exit 1
fi

# Générer Prisma client
echo "📦 Génération du client Prisma..."
npx prisma generate

# Vérifier si la base de données existe
if [ ! -f "prisma/dev.db" ]; then
    echo "🗄️  Création de la base de données..."
    npx prisma db push
    echo "🌱 Peuplement de la base de données avec des données de démonstration..."
    npx prisma db seed
else
    echo "✅ Base de données existante"
fi

echo ""
echo "✅ Tout est prêt !"
echo ""
echo "📊 Analytics activés :"
echo "   - MongoDB: mongodb://localhost:27017/portfolio_analytics"
echo "   - Dashboard: http://localhost:3000/admin/analytics"
echo ""
echo "🔐 Identifiants admin :"
echo "   - Email: admin@portfolio.com"
echo "   - Mot de passe: Admin123!"
echo ""
echo "🌐 Démarrage du serveur de développement..."
echo ""

npm run dev
