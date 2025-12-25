# Guide du Système de Design

## 🎨 Accès rapide

1. Connectez-vous à l'admin : `http://localhost:3000/admin`
2. Cliquez sur **"Design System"** dans le menu ou le dashboard

## ✨ Fonctionnalités Disponibles

### 🎯 Thèmes Prédéfinis (Activation instantanée)

Choisissez parmi 5 thèmes professionnels prêts à l'emploi :

#### 1. **Minimal** (Actif par défaut)
- **Style** : Épuré et moderne
- **Couleurs** : Gris neutres avec accents sombres
- **Usage** : Portfolio professionnel, design sobre
- **Typographie** : Geist Sans (clean et moderne)

#### 2. **Corporate**
- **Style** : Professionnel et structuré
- **Couleurs** : Bleu institutionnel (#1e40af)
- **Usage** : Entreprises, consultants, B2B
- **Typographie** : System fonts (performant)
- **Particularités** : Espacements généreux, ombres prononcées

#### 3. **Creative**
- **Style** : Dynamique et audacieux
- **Couleurs** : Rose vif (#ec4899) et violet (#8b5cf6)
- **Usage** : Créatifs, designers, artistes
- **Typographie** : Titres XXL, texte plus grand
- **Particularités** : Animations rebondissantes, border-radius généreux

#### 4. **Dark Mode**
- **Style** : Sombre et élégant
- **Couleurs** : Fond sombre (#0f172a) avec accents bleus lumineux
- **Usage** : Développeurs, tech, gaming
- **Typographie** : Poids plus légers pour meilleure lisibilité
- **Particularités** : Ombres plus prononcées, contrastes élevés

#### 5. **Tech**
- **Style** : Futuriste et technique
- **Couleurs** : Cyan (#06b6d4) et violet
- **Usage** : Startups tech, développeurs, SaaS
- **Typographie** : Titres en monospace (code-like)
- **Particularités** : Angles vifs, transitions rapides

## 🔄 Comment Changer de Thème

1. **Naviguez** vers "Design System" dans l'admin
2. **Prévisualisez** les thèmes avec les cartes de couleurs
3. **Cliquez** sur "Activer ce thème" sur le thème souhaité
4. **Attendez** quelques secondes (la page se recharge automatiquement)
5. **Visualisez** : Retournez sur le site public pour voir le nouveau thème

## 🎨 Anatomie d'un Thème

Chaque thème contient des **Design Tokens** structurés :

### Couleurs
```
Primary    : Boutons, liens, éléments interactifs
Secondary  : Accents secondaires
Background : Fond principal et alternatif
Text       : Titres, corps, texte discret
Border     : Bordures et séparateurs
```

### Typographie
```
Heading : Police pour les titres (H1-H6)
Body    : Police pour le texte courant
Mono    : Police monospace (code)
Sizes   : Échelle de tailles (H1: 3.75rem → Small: 0.875rem)
Weights : Normal, Medium, Semibold, Bold
```

### Espacements
```
Section   : Padding vertical/horizontal des sections
Card      : Padding et gap des cartes
Container : Largeur max et padding du conteneur
```

### Border Radius
```
Button : Arrondi des boutons
Card   : Arrondi des cartes
Input  : Arrondi des champs
Image  : Arrondi des images
```

### Ombres
```
sm : Légère (hover states)
md : Moyenne (cards)
lg : Prononcée (modals)
xl : Très prononcée (popups)
```

### Animations
```
Duration : Fast (150ms), Normal (300ms), Slow (500ms)
Easing   : Courbe de transition (cubic-bezier)
Hover    : Scale et translateY au survol
```

## 🚀 Utilisation Avancée (À venir)

### Prochaines Fonctionnalités

#### Sprint 2 : Éditeur de Couleurs
- Color picker intégré
- Génération automatique de variations (hover, light, dark)
- Preview en temps réel
- Export de palette

#### Sprint 3 : Éditeur de Typographie
- Intégration Google Fonts (1000+ fonts)
- Preview instantané des fonts
- Échelle typographique automatique
- Import de fonts personnalisées

#### Sprint 4 : Éditeur d'Espacements
- Sliders visuels pour padding/margin
- Grid configuration
- Preview de layout
- Presets (compact, normal, aéré)

#### Sprint 5 : Personnalisation de Composants
- Customisation des boutons (style, taille, animations)
- Customisation des cards
- States (normal, hover, active, disabled)
- Preview par composant

#### Sprint 6 : Éditeur d'Animations
- Contrôle des durées
- Sélection d'easing curves
- Preview d'animations
- Timeline editor

#### Sprint 7 : Import/Export
- Exporter le thème actif en JSON
- Importer un thème depuis JSON
- Partager des thèmes entre projets
- Marketplace de thèmes (optionnel)

## 💡 Astuces & Best Practices

### Choix du Thème Approprié

**Portfolio Personnel / Freelance** → Minimal ou Creative
- Minimal : Plus sobre, met en avant le contenu
- Creative : Plus dynamique, capte l'attention

**Entreprise / B2B** → Corporate
- Inspire confiance et professionnalisme
- Couleurs institutionnelles

**Tech / Développeur** → Tech ou Dark Mode
- Tech : Moderne et futuriste
- Dark : Confortable pour les yeux, tendance

**Artiste / Designer** → Creative
- Couleurs vibrantes
- Animations prononcées

### Cohérence Visuelle

✅ **À faire** :
- Tester le thème sur toutes les pages
- Vérifier la lisibilité du texte
- S'assurer que les CTA sont visibles
- Tester sur mobile

❌ **À éviter** :
- Changer trop souvent de thème
- Mixer plusieurs thèmes sur des pages différentes
- Négliger le contraste texte/fond

### Performance

- Les thèmes sont chargés **une seule fois** au démarrage
- Changement de thème = **rechargement de page** (rapide)
- CSS Variables = **performance native**
- Pas d'impact sur le bundle size

## 🔧 Développement de Thèmes Personnalisés

### Structure d'un Thème (JSON)

```json
{
  "colors": {
    "primary": { "main": "#hex", "hover": "#hex", "light": "#hex" },
    "secondary": { "main": "#hex", "hover": "#hex" },
    "background": { "main": "#hex", "alt": "#hex" },
    "text": { "primary": "#hex", "secondary": "#hex", "muted": "#hex" },
    "border": { "main": "#hex", "light": "#hex" }
  },
  "typography": {
    "fontFamily": {
      "heading": "font-name",
      "body": "font-name",
      "mono": "font-name"
    },
    "fontSize": {
      "h1": "3.75rem", "h2": "3rem", "h3": "2.25rem", 
      "h4": "1.875rem", "body": "1rem", "small": "0.875rem"
    },
    "fontWeight": {
      "normal": "400", "medium": "500", 
      "semibold": "600", "bold": "700"
    },
    "lineHeight": {
      "tight": "1.25", "normal": "1.5", "relaxed": "1.75"
    }
  },
  "spacing": {
    "section": { "y": "4rem", "x": "1.5rem" },
    "card": { "padding": "1.5rem", "gap": "1rem" },
    "container": { "maxWidth": "80rem", "padding": "1.5rem" }
  },
  "borderRadius": {
    "button": "9999px", "card": "1rem", 
    "input": "0.5rem", "image": "1rem"
  },
  "shadows": {
    "sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
  },
  "animation": {
    "duration": { "fast": "150ms", "normal": "300ms", "slow": "500ms" },
    "easing": "cubic-bezier(0.4, 0, 0.2, 1)",
    "hover": { "scale": "1.05", "translateY": "-2px" }
  }
}
```

### Créer un Thème via l'API

```bash
POST /api/themes
Content-Type: application/json

{
  "name": "mon-theme",
  "displayName": "Mon Thème Personnalisé",
  "config": { ... } // Structure ci-dessus
}
```

## 📊 Statistiques & Analytics

Les changements de thème sont automatiquement :
- ✅ Sauvegardés dans la base de données
- ✅ Appliqués immédiatement après activation
- ✅ Persistants (pas de perte au redémarrage)
- ✅ Partagés sur tout le site

## 🆘 Dépannage

### Le thème ne s'applique pas
1. Rafraîchir la page (Cmd/Ctrl + R)
2. Vider le cache du navigateur
3. Vérifier la console pour des erreurs

### Les couleurs ne changent pas partout
- Normal : Le système est progressif
- Les pages seront migrées vers les CSS Variables
- Certains éléments utilisent encore Tailwind hard-coded

### Erreur "Thème non trouvé"
- Vérifier que le thème existe dans `/api/themes`
- Réinitialiser les thèmes : `npx tsx scripts/init-themes.ts`

### Le site est cassé après changement de thème
- Retourner sur `/admin/design-system`
- Réactiver le thème "Minimal" (défaut)
- Recharger le site public

## 🎓 Ressources

- **Documentation complète** : `/docs/PERSONALISATION_GRANULAIRE.md`
- **Roadmap** : Voir la doc pour les fonctionnalités à venir
- **Support** : Issues GitHub ou contact admin

## 🚀 Prochaines Étapes

1. **Testez tous les thèmes** sur votre contenu
2. **Choisissez celui qui correspond** à votre marque
3. **Attendez les prochains sprints** pour plus de customisation
4. **Partagez vos thèmes** une fois l'export disponible

---

**Version** : 1.0 - Sprint 1 Complété ✅
**Date** : Novembre 2025
**Niveau de personnalisation** : Thèmes prédéfinis (5 disponibles)
