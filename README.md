# Glovo Plus — Smart Delivery

Plateforme de livraison intelligente (type Glovo / Yango Deli) construite en **architecture
microservices**, réalisée dans le cadre du *Projet final — Architecture Microservices*
(énoncé : `attached_assets/Pasted-PROJET-FINAL-Architecture-Microservices-*.txt`).

Elle gère les **utilisateurs** (rôles client / livreur / admin), les **restaurants et produits**,
les **commandes** (total calculé par le service, appels inter-services, résilience) et les
**livraisons** (assignation d'un livreur, statuts `EN_ATTENTE` → `EN_COURS` → `LIVRE`), avec un
service **ML** d'estimation du temps de livraison.

Site web (frontend seul) : https://trixma-ux.github.io/glovo-plus/

## Architecture

```txt
Frontend React (Vite)  →  API Gateway (/api)  →  user-service        :3001  → PostgreSQL users_db
                                               →  restaurant-service  :3002  → PostgreSQL restaurant_db
                                               →  order-service       :3003  → PostgreSQL orders_db
                                               │      ↳ appelle user-service + restaurant-service
                                               │        (retry + circuit breaker, erreurs 503 propres)
                                               →  delivery-service    :3004  → PostgreSQL delivery_db
                                               │      ↳ appelle order-service + ml-service
                                               →  ml-service (FastAPI) :3005
```

| Dossier | Rôle |
|---|---|
| `services/frontend/` | Frontend React + Vite + Bootstrap (le site déployé sur GitHub Pages) |
| `services/api-gateway/` | API Gateway NestJS (port 3000, utilisée par Docker Compose) |
| `services/user-service/` | Inscription, connexion JWT, gestion des utilisateurs (NestJS + Prisma) |
| `services/restaurant-service/` | Restaurants et produits (NestJS + Prisma) |
| `services/order-service/` | Commandes, calcul du total, communication inter-services (NestJS + Prisma) |
| `services/delivery-service/` | Livraisons et statuts (NestJS + Prisma) |
| `services/ml-service/` | Prédiction du temps de livraison (FastAPI + scikit-learn) |
| `services/docker-compose.yml` | Lancement complet : 1 conteneur par service + 4 bases PostgreSQL |
| `artifacts/api-server/` | Passerelle Express alternative (proxy `/api`, utilisée sur Replit, port 8080) |
| `artifacts/mockup-sandbox/` | Outil de prévisualisation de composants Replit (non déployé) |

## Lancer en local

### Tout le système (recommandé)

```bash
cd services
docker compose up --build
```

- Frontend : http://localhost:5173
- API Gateway : http://localhost:3000/api (Swagger : http://localhost:3000/api/docs)
- Swagger de chaque service : ports 3001 à 3004 (`/api/docs`), ML : http://localhost:3005/docs

Arrêt : `docker compose down` (ajouter `-v` pour supprimer les données).

### Frontend seul

```bash
cd services/frontend
npm ci
npm run dev          # http://localhost:5173, API par défaut : http://localhost:3000/api
npm run build        # build de production dans dist/
```

Pour viser une autre API : `VITE_API_URL=https://ma-gateway.exemple.com npm run build`.

## Scénario de démonstration (énoncé §6)

1. Créer un compte (page *Inscription*) puis se connecter.
2. Créer un restaurant, puis des produits.
3. Créer une commande avec un ou plusieurs produits : l'order-service vérifie l'utilisateur
   (user-service), récupère les produits (restaurant-service) et calcule le total.
4. Assigner un livreur (utilisateur de rôle *LIVREUR*) et faire évoluer le statut.
5. **Simuler une panne** : `docker stop restaurant-service`, puis créer une commande — le
   frontend affiche le message d'erreur renvoyé par l'order-service (ex. « Impossible de
   récupérer les produits »). `docker start restaurant-service` pour rétablir.

## Déploiement du frontend (GitHub Pages)

Le workflow `.github/workflows/deploy-web.yml` se déclenche à chaque push sur `main` (ou à la
main via *Run workflow*) : il installe `services/frontend`, lance
`vite build --base=/glovo-plus/`, ajoute `404.html` (routes SPA) et `.nojekyll`, puis publie
`services/frontend/dist` sur la branche `gh-pages` avec `peaceiris/actions-gh-pages`.

Pré-requis côté dépôt : *Settings → Pages → Deploy from a branch → `gh-pages` / `(root)`*.

GitHub Pages n'héberge que le frontend statique. Les microservices et leurs bases doivent être
hébergés ailleurs ; tant que `VITE_API_URL` n'est pas défini (ou si la gateway est injoignable),
le site affiche un bandeau « API non configurée / indisponible » au lieu d'échouer en silence.

## Variables d'environnement

### Frontend (`services/frontend`, au moment du build)

| Variable | Défaut | Rôle |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000/api` en dev, vide en production | URL publique de l'API Gateway (le suffixe `/api` est ajouté s'il manque). En CI : *variable de dépôt* `VITE_API_URL` (Settings → Secrets and variables → Actions → Variables). |

### Backend (voir `services/docker-compose.yml`)

| Service | Variables |
|---|---|
| api-gateway | `PORT`, `JWT_SECRET`, `USER_SERVICE_URL`, `RESTAURANT_SERVICE_URL`, `ORDER_SERVICE_URL`, `DELIVERY_SERVICE_URL`, `ML_SERVICE_URL` |
| user-service | `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN` |
| restaurant-service | `PORT`, `DATABASE_URL` |
| order-service | `PORT`, `DATABASE_URL`, `USER_SERVICE_URL`, `RESTAURANT_SERVICE_URL` |
| delivery-service | `PORT`, `DATABASE_URL`, `ORDER_SERVICE_URL`, `ML_SERVICE_URL` |
| ml-service | aucune (port 3005) |

Chaque service NestJS applique son schéma Prisma (`npm run prisma:push`) sur sa propre base.
