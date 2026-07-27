# ZWITA — Espace admin

Page web protégée pour suivre les joueurs et l'activité du jeu, sans donner
d'accès SSH à la VM. À partager par simple URL + mot de passe (ami, client).

- **URL** : `https://zwita.gr07-idriss.work.gd/admin`
- **Connexion** : mot de passe unique (variable d'environnement `ADMIN_PASSWORD`).

## Ce qu'on y voit

- **Tuiles** : nombre de joueurs, parties démarrées, parties terminées, total
  des scans, bons scans.
- **Joueurs** : pseudo, avatar, score, progression (stations trouvées / total),
  statut (en cours / terminé), dernière activité. Clic sur un joueur → son
  historique complet.
- **Activité** : flux en temps quasi réel (rafraîchi toutes les 20 s).

## Comment ça marche

Chaque téléphone envoie des événements au serveur en « fire-and-forget » :
ouverture du jeu, choix du profil, début de parcours, scans (bons/mauvais),
fin de partie, réinitialisation. Si le réseau est mauvais (huilerie souterraine),
les événements sont mis en file et renvoyés plus tard — le jeu n'est jamais
bloqué.

**Vie privée** : on ne stocke que le pseudo et un identifiant anonyme. Jamais
d'email, de téléphone ni de position (conforme à `AGENTS.md`).

## Stockage

SQLite, un seul fichier. En production il vit dans un volume Docker monté sur
`/data` (`ZWITA_DB_PATH=/data/zwita.db` par défaut dans l'image), **pour qu'il
survive aux redéploiements**. Deux tables : `events` (journal append-only) et
`players` (état courant par joueur, mis à jour à chaque événement).

## Déploiement (VM Azure, derrière Traefik)

Deux ajouts par rapport à avant : la variable `ADMIN_PASSWORD` et le volume
`/data`.

```bash
cd ~/zwita && git pull
docker build -t zwita:latest .
docker rm -f zwita

docker run -d --name zwita --restart unless-stopped \
  --network idriss_app-network \
  -v zwita-data:/data \
  -e ADMIN_PASSWORD='choisis-un-mot-de-passe-solide' \
  --label 'traefik.enable=true' \
  --label 'traefik.http.routers.zwita.rule=Host(`zwita.gr07-idriss.work.gd`)' \
  --label 'traefik.http.routers.zwita.entrypoints=websecure' \
  --label 'traefik.http.routers.zwita.tls.certresolver=myresolver' \
  --label 'traefik.http.services.zwita.loadbalancer.server.port=3000' \
  zwita:latest
```

- `-v zwita-data:/data` : le volume nommé conserve la base entre les
  redéploiements. Ne pas l'oublier, sinon l'historique repart de zéro à chaque
  `docker rm`.
- `-e ADMIN_PASSWORD='…'` : si absent, l'espace admin est désactivé (la
  connexion échoue avec « admin non configuré ») ; le jeu et la collecte
  d'événements fonctionnent quand même.
- Changer `ADMIN_PASSWORD` déconnecte toutes les sessions admin ouvertes.

## Sauvegarde de la base

```bash
docker run --rm -v zwita-data:/data -v "$PWD:/backup" alpine \
  cp /data/zwita.db /backup/zwita-backup.db
```

## Réinitialiser les données

```bash
docker rm -f zwita
docker volume rm zwita-data
# puis relancer le docker run ci-dessus
```
