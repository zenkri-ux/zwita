# Vidéo d'accueil

Dépose ici le fichier **`welcome-bg.mp4`** (nom exact) : il s'affiche
automatiquement en fond de l'écran d'accueil.

Si le fichier est absent, l'écran reste sur la photo
`/images/mill/exterior/exterior-wide.jpg` — jamais de fond noir ni cassé.

## Contraintes

- **Format** : MP4 / H.264 + AAC (compatible iOS et Android).
- **Sans piste audio** : la vidéo est muette (obligatoire pour l'autoplay).
- **Poids** : viser **moins de 3 Mo**. C'est le tout premier fichier chargé,
  et le réseau est mauvais dans la huilerie souterraine.
- **Format vertical** (9:16) : elle est affichée en plein écran sur mobile.
- **Boucle courte** (5–10 s) sans coupure brutale.

Compression conseillée :

```bash
ffmpeg -i source.mp4 -an -vf "scale=-2:1280" -c:v libx264 -crf 30 \
  -preset slow -movflags +faststart welcome-bg.mp4
```

(`-an` retire l'audio, `-movflags +faststart` permet la lecture avant
téléchargement complet.)

## Comportement

La vidéo n'est PAS jouée si le visiteur a activé « réduire les animations »
sur son téléphone : la photo est alors affichée à la place.
