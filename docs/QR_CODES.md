# ZWITA — Liens QR à imprimer (9 codes)

**Source de vérité :** `src/content/stations.ts` (champ `scanCode`).
**Base URL actuelle :** `http://51.103.179.122` (VM Azure), configurable via
`NEXT_PUBLIC_BASE_URL`.

> ⚠️ **À lire avant impression**
> - L'URL est **encodée en dur dans l'image du QR**. Si le domaine change
>   (ex. passage à `https://zwita.tn`), **il faut réimprimer** tous les QR.
> - Les `scanCode` ne doivent **jamais** être modifiés une fois imprimés.
> - Les codes évitent les caractères ambigus (`0/O`, `1/I/L`) pour rester
>   lisibles s'ils sont saisis à la main.

---

## 1. QR d'entrée — plaque « Histoire »

Ce QR **n'est pas une station** : il sert à accéder au site / démarrer le jeu.
À coller sur la plaque d'histoire (panneau d'introduction).

```
http://51.103.179.122/
```

## 2. QR des 8 stations (une plaque = un code unique)

| # | Station | Plaque / panneau | Code | URL à encoder dans le QR |
|---|---------|------------------|------|--------------------------|
| 1 | `access-corridor` | الممر — Couloir d'accès | `M3K7Q2` | `http://51.103.179.122/q/M3K7Q2` |
| 2 | `olive-storage` | مخزن الزيتون — Stockage des olives | `R9T4XB` | `http://51.103.179.122/q/R9T4XB` |
| 3 | `crusher-mdar` | المدار — Meule / broyeur | `P6H2ZC` | `http://51.103.179.122/q/P6H2ZC` |
| 4 | `rudimentary-press` | المِعصرة — Presse traditionnelle | `D8V5NK` | `http://51.103.179.122/q/D8V5NK` |
| 5 | `boiler` | المرجل — Chaudière | `T2Y7WF` | `http://51.103.179.122/q/T2Y7WF` |
| 6 | `settling-jars` | جِرار الترقيد — Jarres de décantation | `J4B9RM` | `http://51.103.179.122/q/J4B9RM` |
| 7 | `byproducts` | المنتجات الجانبية — Sous-produits | `X7C3PD` | `http://51.103.179.122/q/X7C3PD` |
| 8 | `dome` | القُبّة — Coupole | `H5N8VQ` | `http://51.103.179.122/q/H5N8VQ` |

### Liste brute (à copier dans un générateur de QR)

```
http://51.103.179.122/
http://51.103.179.122/q/M3K7Q2
http://51.103.179.122/q/R9T4XB
http://51.103.179.122/q/P6H2ZC
http://51.103.179.122/q/D8V5NK
http://51.103.179.122/q/T2Y7WF
http://51.103.179.122/q/J4B9RM
http://51.103.179.122/q/X7C3PD
http://51.103.179.122/q/H5N8VQ
```

### JSON (pour génération automatisée)

```json
[
  { "type": "entry",   "station": "history",           "url": "http://51.103.179.122/" },
  { "type": "station", "station": "access-corridor",   "code": "M3K7Q2", "url": "http://51.103.179.122/q/M3K7Q2" },
  { "type": "station", "station": "olive-storage",     "code": "R9T4XB", "url": "http://51.103.179.122/q/R9T4XB" },
  { "type": "station", "station": "crusher-mdar",      "code": "P6H2ZC", "url": "http://51.103.179.122/q/P6H2ZC" },
  { "type": "station", "station": "rudimentary-press", "code": "D8V5NK", "url": "http://51.103.179.122/q/D8V5NK" },
  { "type": "station", "station": "boiler",            "code": "T2Y7WF", "url": "http://51.103.179.122/q/T2Y7WF" },
  { "type": "station", "station": "settling-jars",     "code": "J4B9RM", "url": "http://51.103.179.122/q/J4B9RM" },
  { "type": "station", "station": "byproducts",        "code": "X7C3PD", "url": "http://51.103.179.122/q/X7C3PD" },
  { "type": "station", "station": "dome",              "code": "H5N8VQ", "url": "http://51.103.179.122/q/H5N8VQ" }
]
```

---

## Comment ça marche

1. Le joueur ouvre le site (QR d'entrée sur la plaque Histoire), choisit son nom,
   sa langue, lit les règles, puis reçoit un **indice** en arabe.
2. Il cherche la station décrite et scanne le QR de la plaque avec l'appareil
   photo **natif** de son téléphone.
3. Le téléphone ouvre `…/q/<CODE>`. L'app compare le code à la station attendue :
   - **bon panneau** → photo + petite explication (+ info bonus), puis l'indice
     suivant se débloque ;
   - **mauvais panneau** → message bienveillant, il continue à chercher ;
   - **déjà découvert / code inconnu / illisible** → message adapté.
4. Après les 8 stations : écran final avec titre et score.

La progression est enregistrée localement (IndexedDB) sur le téléphone du
joueur : fermer l'onglet ou recharger ne perd rien.

**Saisie manuelle :** si le scan échoue (mauvaise lumière, caméra refusée), le
joueur peut taper le code court (ex. `P6H2ZC`) dans l'app.

---

## Changer de domaine plus tard

1. Rebuild avec la nouvelle base : `NEXT_PUBLIC_BASE_URL=https://mon-domaine.tn`
2. Régénérer ce fichier + les images QR à partir des mêmes `scanCode`.
3. Réimprimer les plaques.

Les `scanCode` restant identiques, seul le préfixe d'URL change.

## Limites connues (HTTP sans domaine)

Tant que le site est servi en **HTTP sur une IP** :
- la **caméra intégrée** à l'app ne fonctionne pas sur mobile (`getUserMedia`
  exige HTTPS) → c'est pourquoi le parcours principal passe par l'appareil photo
  natif + le lien `/q/<code>`, qui lui marche en HTTP ;
- le **service worker / mode hors-ligne PWA** reste inactif (HTTPS requis).

Passer en HTTPS (domaine + certificat) réactive la caméra intégrée et le mode
hors-ligne, sans changer les `scanCode`.
