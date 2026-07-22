# ZWITA — Liens QR à imprimer (9 codes)

**Source de vérité :** `src/content/stations.ts` (champ `scanCode`).
**Base URL de production :** `https://zwita.gr07-idriss.work.gd`
(VM Azure `51.103.179.122`, servie en HTTPS par Traefik + Let's Encrypt),
configurable via `NEXT_PUBLIC_BASE_URL`.

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
https://zwita.gr07-idriss.work.gd/
```

## 2. QR des 8 stations (une plaque = un code unique)

| # | Station | Plaque / panneau | Code | URL à encoder dans le QR |
|---|---------|------------------|------|--------------------------|
| 1 | `access-corridor` | الممر — Couloir d'accès | `M3K7Q2` | `https://zwita.gr07-idriss.work.gd/q/M3K7Q2` |
| 2 | `olive-storage` | مخزن الزيتون — Stockage des olives | `R9T4XB` | `https://zwita.gr07-idriss.work.gd/q/R9T4XB` |
| 3 | `crusher-mdar` | المدار — Meule / broyeur | `P6H2ZC` | `https://zwita.gr07-idriss.work.gd/q/P6H2ZC` |
| 4 | `rudimentary-press` | المِعصرة — Presse traditionnelle | `D8V5NK` | `https://zwita.gr07-idriss.work.gd/q/D8V5NK` |
| 5 | `boiler` | المرجل — Chaudière | `T2Y7WF` | `https://zwita.gr07-idriss.work.gd/q/T2Y7WF` |
| 6 | `settling-jars` | جِرار الترقيد — Jarres de décantation | `J4B9RM` | `https://zwita.gr07-idriss.work.gd/q/J4B9RM` |
| 7 | `byproducts` | المنتجات الجانبية — Sous-produits | `X7C3PD` | `https://zwita.gr07-idriss.work.gd/q/X7C3PD` |
| 8 | `dome` | القُبّة — Coupole | `H5N8VQ` | `https://zwita.gr07-idriss.work.gd/q/H5N8VQ` |

### Liste brute (à copier dans un générateur de QR)

```
https://zwita.gr07-idriss.work.gd/
https://zwita.gr07-idriss.work.gd/q/M3K7Q2
https://zwita.gr07-idriss.work.gd/q/R9T4XB
https://zwita.gr07-idriss.work.gd/q/P6H2ZC
https://zwita.gr07-idriss.work.gd/q/D8V5NK
https://zwita.gr07-idriss.work.gd/q/T2Y7WF
https://zwita.gr07-idriss.work.gd/q/J4B9RM
https://zwita.gr07-idriss.work.gd/q/X7C3PD
https://zwita.gr07-idriss.work.gd/q/H5N8VQ
```

### JSON (pour génération automatisée)

```json
[
  { "type": "entry",   "station": "history",           "url": "https://zwita.gr07-idriss.work.gd/" },
  { "type": "station", "station": "access-corridor",   "code": "M3K7Q2", "url": "https://zwita.gr07-idriss.work.gd/q/M3K7Q2" },
  { "type": "station", "station": "olive-storage",     "code": "R9T4XB", "url": "https://zwita.gr07-idriss.work.gd/q/R9T4XB" },
  { "type": "station", "station": "crusher-mdar",      "code": "P6H2ZC", "url": "https://zwita.gr07-idriss.work.gd/q/P6H2ZC" },
  { "type": "station", "station": "rudimentary-press", "code": "D8V5NK", "url": "https://zwita.gr07-idriss.work.gd/q/D8V5NK" },
  { "type": "station", "station": "boiler",            "code": "T2Y7WF", "url": "https://zwita.gr07-idriss.work.gd/q/T2Y7WF" },
  { "type": "station", "station": "settling-jars",     "code": "J4B9RM", "url": "https://zwita.gr07-idriss.work.gd/q/J4B9RM" },
  { "type": "station", "station": "byproducts",        "code": "X7C3PD", "url": "https://zwita.gr07-idriss.work.gd/q/X7C3PD" },
  { "type": "station", "station": "dome",              "code": "H5N8VQ", "url": "https://zwita.gr07-idriss.work.gd/q/H5N8VQ" }
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

## Déploiement

Le site tourne sur la VM Azure derrière le Traefik existant, en HTTPS :

```bash
docker build -t zwita:latest .

docker run -d --name zwita --restart unless-stopped \
  --network idriss_app-network \
  --label 'traefik.enable=true' \
  --label 'traefik.http.routers.zwita.rule=Host(`zwita.gr07-idriss.work.gd`)' \
  --label 'traefik.http.routers.zwita.entrypoints=websecure' \
  --label 'traefik.http.routers.zwita.tls.certresolver=myresolver' \
  --label 'traefik.http.services.zwita.loadbalancer.server.port=3000' \
  zwita:latest
```

Le certificat est émis automatiquement par Let's Encrypt au premier accès.
Prérequis : l'enregistrement DNS `zwita.gr07-idriss.work.gd → 51.103.179.122`.

Note : la VM n'a que ~900 Mo de RAM ; un fichier d'échange (swap) de 2 Go est
nécessaire pour que `next build` aboutisse.

## Ce que le HTTPS apporte

Comme le site est servi en HTTPS (et non en HTTP sur une IP) :
- ✅ la **caméra intégrée** à l'app fonctionne (`getUserMedia` exige un contexte
  sécurisé) — en plus de l'appareil photo natif ;
- ✅ le **service worker / mode hors-ligne PWA** est actif, ce qui compte dans
  une huilerie souterraine où le réseau est mauvais ;
- ✅ l'app est installable sur l'écran d'accueil.
