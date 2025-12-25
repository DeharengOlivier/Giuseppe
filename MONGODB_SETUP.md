# Installation et démarrage de MongoDB

## Installation sur macOS

```bash
# Installer MongoDB avec Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Démarrer MongoDB
brew services start mongodb-community@7.0

# Vérifier que MongoDB fonctionne
mongosh --eval "db.runCommand({ ping: 1 })"
```

## Installation sur Linux (Ubuntu/Debian)

```bash
# Importer la clé publique
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Ajouter le repository
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Installer MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org

# Démarrer MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Vérifier
mongosh --eval "db.runCommand({ ping: 1 })"
```

## Installation sur Windows

1. Télécharger MongoDB Community Server depuis https://www.mongodb.com/try/download/community
2. Installer en suivant l'assistant d'installation
3. MongoDB démarre automatiquement comme service Windows

## Vérification

Une fois MongoDB installé et démarré, vous pouvez vérifier qu'il fonctionne :

```bash
# Se connecter à MongoDB
mongosh

# Dans le shell MongoDB
show dbs
use portfolio_analytics
db.visits.find().limit(5)
```

## Configuration

L'URL de connexion MongoDB est configurée dans le fichier `.env` :

```
MONGODB_URI="mongodb://localhost:27017/portfolio_analytics"
```

## Fonctionnalités Analytics

Le système d'analytics collecte automatiquement :

- **IP du visiteur** : Adresse IP de l'appareil
- **Page visitée** : URL de la page consultée
- **Localisation** : Pays, région, ville basés sur l'IP
- **Coordonnées GPS** : Latitude/longitude approximatives
- **Timezone** : Fuseau horaire du visiteur
- **User Agent** : Informations sur le navigateur/appareil
- **Referer** : D'où vient le visiteur (direct, Google, etc.)
- **Timestamp** : Date et heure de la visite

### Accéder aux analytics

1. Connectez-vous à l'admin : http://localhost:3000/admin/login
2. Cliquez sur "Analytics" dans la navigation
3. Visualisez les statistiques et les visites en temps réel

### Statistiques disponibles

- Nombre de visites (24h, 7 jours, total)
- Top 10 des pays
- Top 10 des pages
- Graphique des visites par jour
- Liste détaillée de toutes les visites avec filtres

### Pas de rate limiting

Le système collecte **toutes** les visites sans limitation pour avoir des données complètes.
