# Configuration du fond Hero

## Accès à la configuration

1. Connectez-vous à l'admin : `http://localhost:3000/admin`
2. Allez dans **Contenu des pages**
3. Trouvez la section **Hero Background**

## Options disponibles

### 1. Type de fond

Sélectionnez parmi 3 options :

- **Dégradé** : Un dégradé subtil gris clair (par défaut)
- **Image** : Une image de fond fixe
- **Vidéo** : Une vidéo en lecture automatique et en boucle

### 2. Configuration selon le type

#### Si vous choisissez "Image" :
- **URL de l'image de fond** : Collez l'URL complète de votre image
  - Exemple : `https://images.unsplash.com/photo-1557683316-973673baf926`
  - Format recommandé : JPEG ou WebP
  - Résolution recommandée : 1920x1080px minimum

#### Si vous choisissez "Vidéo" :
- **URL de la vidéo de fond** : Collez l'URL complète de votre vidéo
  - Exemple : `https://example.com/video.mp4`
  - Format supporté : MP4
  - Résolution recommandée : 1920x1080px
  - Poids recommandé : < 10MB pour de bonnes performances
  - La vidéo sera en autoplay, loop et muted

### 3. Opacité de l'overlay

- Valeur entre **0** et **100**
- **50** par défaut (recommandé pour une bonne lisibilité)
- Plus la valeur est élevée, plus le fond est assombri
- Utile pour améliorer le contraste du texte blanc sur l'image/vidéo

## Comportement du texte

- **Avec dégradé** : Texte noir sur fond clair
- **Avec image/vidéo** : Texte blanc avec ombre portée pour une meilleure lisibilité

## Hébergement des médias

### Options gratuites pour les images :
- [Unsplash](https://unsplash.com/) - Images gratuites de haute qualité
- [Pexels](https://www.pexels.com/) - Photos et vidéos gratuites
- [Pixabay](https://pixabay.com/) - Images et vidéos libres de droits

### Options pour héberger vos propres médias :
- **Cloudinary** (gratuit jusqu'à 25GB)
- **Imgur** (gratuit pour les images)
- **Vimeo** (pour les vidéos)

### Utiliser un fichier local :
1. Placez votre fichier dans `/public/media/`
2. Dans l'admin, utilisez l'URL : `/media/votre-fichier.jpg` ou `/media/votre-video.mp4`

## Exemples d'URLs

### Images Unsplash :
```
https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80
https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80
```

### Vidéos Pexels :
```
https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_30fps.mp4
```

## Conseils de performance

- Utilisez des images optimisées (compressées)
- Pour les vidéos, privilégiez :
  - Format MP4 (H.264)
  - Durée courte (10-20 secondes en boucle)
  - Résolution adaptée (1920x1080 max)
  - Bitrate modéré (2-4 Mbps)

## Résolution de problèmes

### L'image ne s'affiche pas
- Vérifiez que l'URL est correcte et accessible
- Vérifiez que l'image n'est pas bloquée par CORS
- Essayez avec une image Unsplash pour tester

### La vidéo ne se lance pas
- Vérifiez le format (doit être MP4)
- Vérifiez que l'URL est directe vers le fichier .mp4
- Sur mobile, certaines vidéos peuvent ne pas se lancer automatiquement

### Le texte n'est pas lisible
- Augmentez l'opacité de l'overlay (essayez 60-70)
- Choisissez une image/vidéo moins contrastée
- Utilisez une image plus sombre
