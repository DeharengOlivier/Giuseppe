# Guide d'Administration du Portfolio

## 🎯 Vue d'ensemble

Ce portfolio est une application **100% dynamique** où tout le contenu peut être géré via une interface d'administration intuitive. Aucune modification de code n'est nécessaire pour mettre à jour le contenu du site.

## 📊 Tableau de Bord

Le tableau de bord vous donne un accès rapide à toutes les fonctionnalités :
- Gestion des articles
- Gestion des prestations
- Gestion des expériences
- Modification du contenu des pages
- Aperçu du site public

## ✍️ Gestion des Articles

### Créer un Article
1. Cliquez sur **"Articles"** dans le menu de navigation
2. Cliquez sur **"+ Nouvel article"**
3. Remplissez les champs :
   - **Titre** : Le titre de votre article (obligatoire)
   - **Extrait** : Un court résumé qui apparaît dans les listes
   - **Contenu** : Le texte complet avec l'éditeur riche
4. Utilisez l'éditeur pour formater votre texte :
   - **Gras** / *Italique*
   - Titres (H2, H3)
   - Listes à puces ou numérotées
   - Citations
   - Code inline
5. Cochez **"Publier cet article"** pour le rendre visible
6. Cliquez sur **"Enregistrer"**

### Modifier un Article
- Depuis la liste des articles, cliquez sur **"Modifier"**
- Effectuez vos changements
- Sauvegardez

### Supprimer un Article
- Cliquez sur **"Supprimer"** (une confirmation sera demandée)

### Statut de Publication
- ✅ **Publié** (oeil vert) : Visible sur le site public
- ⭕ **Brouillon** (oeil gris) : Visible uniquement dans l'admin

### URLs des Articles
Les URLs sont générées automatiquement depuis le titre :
- Titre : "Les tendances web en 2025"
- URL : `/articles/les-tendances-web-en-2025`

## 💼 Gestion des Prestations

### Créer une Prestation
1. Allez dans **"Prestations"**
2. Cliquez sur **"+ Nouvelle prestation"**
3. Remplissez :
   - **Titre** : Nom de la prestation
   - **Description** : Description détaillée
   - **Prix** : Prix ou fourchette (optionnel)
   - **Bénéfices** : Liste des avantages principaux
   - **Ordre d'affichage** : Numéro pour l'ordre (1 = premier)
4. Cliquez sur **"+ Ajouter un bénéfice"** pour ajouter des points
5. Sauvegardez

### Conseils
- Utilisez des **bénéfices concrets** et orientés client
- L'**ordre d'affichage** permet de prioriser vos offres
- Le **prix** peut être une fourchette : "À partir de 3 000€"

## 🏢 Gestion des Expériences

### Ajouter une Expérience
1. Cliquez sur **"Expériences"**
2. **"+ Nouvelle expérience"**
3. Complétez :
   - **Poste** : Votre titre de poste
   - **Entreprise** : Nom de l'entreprise
   - **Lieu** : Ville, pays (optionnel)
   - **Date de début** : Date de commencement
   - **Date de fin** : Ou cochez "Poste actuel"
   - **Description** : Détails de votre rôle et réalisations
   - **Compétences** : Technologies et compétences utilisées
   - **Ordre** : Pour l'ordre d'affichage (1 = plus récent)

### Organisation
- Les expériences s'affichent en **timeline** sur le site
- Ordonnez-les chronologiquement (1 = plus récent)
- Les **compétences** apparaissent sous forme de badges

## 🎨 Modification du Contenu des Pages

### Hero Section (Page d'accueil)
Modifiez les éléments du bandeau principal :
- **Nom** : Votre nom complet
- **Titre/Rôle** : Votre positionnement professionnel
- **Phrase de positionnement** : Votre accroche
- **Texte du bouton CTA** : Texte du bouton d'action
- **Lien du bouton CTA** : URL de destination (ex: /prestations)

### Section Services
- **Titre de la section** : Titre de la section prestations
- **Texte d'introduction** : Description courte
- **Texte du bouton** : Texte du bouton vers prestations

### Mise à jour
Les changements sont **appliqués instantanément** après sauvegarde, sans besoin de redémarrer l'application.

## 🔐 Sécurité

### Bonnes Pratiques
1. **Ne partagez jamais** vos identifiants admin
2. **Changez le mot de passe** par défaut immédiatement
3. **Déconnectez-vous** après chaque session
4. Utilisez un **mot de passe fort** (12+ caractères, majuscules, chiffres, symboles)

### Changer le Mot de Passe
Pour l'instant, modifiez directement le fichier `.env` :
```env
ADMIN_EMAIL="votre@email.com"
ADMIN_PASSWORD="NouveauMotDePasse123!"
```
Puis relancez : `npm run db:seed`

## 📱 Responsive Design

Toutes les pages sont **100% responsive** :
- ✅ Mobile (smartphones)
- ✅ Tablette (iPad, etc.)
- ✅ Desktop (ordinateurs)

Testez toujours vos modifications sur différents écrans !

## 🚀 Workflow Recommandé

### Pour un Nouvel Article
1. Rédigez d'abord dans l'éditeur (mode brouillon)
2. Prévisualisez sur le site en vous déconnectant
3. Relisez et corrigez si besoin
4. Publiez quand prêt

### Pour Mettre à Jour une Prestation
1. Modifiez les informations
2. Vérifiez l'affichage sur la page publique
3. Ajustez si nécessaire

### Organisation Générale
- **Articles** : Minimum 1-2 par mois pour maintenir l'engagement
- **Prestations** : Gardez 3-5 offres principales
- **Expériences** : Mettez à jour à chaque changement de poste
- **Contenu pages** : Révisez tous les 6 mois

## 💡 Astuces et Bonnes Pratiques

### Articles
- **Titre** : Court, accrocheur, descriptif (max 60 caractères pour le SEO)
- **Extrait** : 150-160 caractères, donnez envie de lire
- **Contenu** : Structurez avec des titres H2/H3
- **Longueur** : 500-1500 mots idéalement
- **Publiez régulièrement** pour le référencement

### Prestations
- **Bénéfices** : Focalisez sur les résultats clients
- **Prix** : Soyez transparent ou indiquez "Sur devis"
- **Description** : Claire, concise, orientée valeur

### Expériences
- **Quantifiez** : "Équipe de 5 personnes", "15 projets livrés"
- **Résultats** : Mettez en avant vos accomplissements
- **Compétences** : 4-6 compétences clés par expérience

### Contenu Pages
- **Appel à l'action** : Verbes d'action (Découvrir, Explorer, Contacter)
- **Positionnement** : Unique, différenciant, mémorable
- **Cohérence** : Ton et style uniformes sur tout le site

## 🐛 Résolution de Problèmes

### L'article n'apparaît pas sur le site
➡️ Vérifiez qu'il est **publié** (case cochée)

### Les modifications ne s'affichent pas
➡️ Actualisez la page (Ctrl+F5 / Cmd+Shift+R)

### Erreur lors de la sauvegarde
➡️ Vérifiez que tous les champs obligatoires sont remplis

### Déconnexion intempestive
➡️ Reconnectez-vous, votre session a expiré

## 📞 Support

Si vous rencontrez des difficultés :
1. Consultez ce guide
2. Vérifiez les messages d'erreur affichés
3. Assurez-vous d'être connecté
4. Contactez le support technique si le problème persiste

---

**Bonne gestion de votre portfolio ! 🎉**