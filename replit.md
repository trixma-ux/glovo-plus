# Glovo Plus — Smart Delivery Platform

Plateforme de livraison intelligente à architecture microservices (Glovo/Yango Deli style) avec frontend React, API Gateway Express, et 5 microservices NestJS + Python.

## Run & Operate

- All services start automatically via Replit workflows
- Frontend: `http://localhost:5173` (path `/`)
- API Gateway: `http://localhost:8080` (path `/api`)
- User Service: `http://localhost:3001`
- Restaurant Service: `http://localhost:3002`
- Order Service: `http://localhost:3003`
- Delivery Service: `http://localhost:3004`
- ML Service: `http://localhost:3005`

## Stack

- **Frontend**: React + Vite (port 5173)
- **API Gateway**: Express 5 + http-proxy-middleware (port 8080)
- **User Service**: NestJS + Prisma + bcryptjs + JWT (port 3001)
- **Restaurant Service**: NestJS + Prisma (port 3002)
- **Order Service**: NestJS + Prisma (port 3003)
- **Delivery Service**: NestJS + Prisma (port 3004)
- **ML Service**: FastAPI + Python (port 3005)
- **Database**: PostgreSQL (shared, Replit managed)
- **ORM**: Prisma (per service)
- pnpm workspaces, Node.js 24, TypeScript 5.9

## Where things live

- `services/frontend/` — React frontend (login, register, dashboard, restaurants, orders, deliveries, ML prediction)
- `services/user-service/` — Inscription/auth/gestion des utilisateurs
- `services/restaurant-service/` — Restaurants + produits
- `services/order-service/` — Commandes avec calcul du total
- `services/delivery-service/` — Livraisons + statuts
- `services/ml-service/` — Prédictions ML (FastAPI)
- `services/api-gateway/` — NestJS gateway (source, not used in dev)
- `artifacts/api-server/` — Express API Gateway (actif en dev, proxy vers microservices)
- `artifacts/api-server/src/app.ts` — Proxy routes configuration

## Architecture decisions

- Express API server acts as the API Gateway in development (more reliable than NestJS gateway on Node 24)
- All NestJS services require `esModuleInterop: true` in tsconfig for helmet/morgan imports
- bcryptjs used instead of bcrypt (native module compatibility)
- All services share a single PostgreSQL DB with distinct table names (no schema separation needed)
- Frontend calls `/api/*` which proxies to microservices via Express proxy middleware

## API Routes (via `/api`)

| Route | Service | Description |
|-------|---------|-------------|
| POST `/api/users` | User (3001) | Créer un utilisateur (inscription) |
| GET `/api/users` | User (3001) | Lister les utilisateurs |
| POST `/api/auth/login` | User (3001) | Connexion JWT |
| GET/POST `/api/restaurants` | Restaurant (3002) | Gestion restaurants |
| GET/POST `/api/products` | Restaurant (3002) | Gestion produits |
| GET/POST `/api/orders` | Order (3003) | Gestion commandes |
| GET/POST `/api/deliveries` | Delivery (3004) | Gestion livraisons |
| GET `/api/ml/*` | ML (3005) | Prédictions |

## Demo Flow (Présentation)

1. **S'inscrire**: `POST /api/users` ou page `/register`
2. **Se connecter**: `POST /api/auth/login` → JWT token
3. **Créer un restaurant**: `POST /api/restaurants`
4. **Créer un produit**: `POST /api/products`
5. **Passer une commande**: `POST /api/orders` (communique avec user-service + restaurant-service)
6. **Assigner une livraison**: `POST /api/deliveries`
7. **Changer le statut**: `PATCH /api/deliveries/:id/status`
8. **Simuler une panne**: Arrêter un service workflow → 503 depuis le gateway

## User preferences

- Language: Français (UI et API)
- Déploiement: Replit (microservices as workflows)

## Gotchas

- NestJS services need `esModuleInterop: true` (for helmet/morgan)
- bcryptjs (not bcrypt) — native module issues on Node 24
- Artifact services run with absolute paths in artifact.toml
- API Gateway (Express) at port 8080, NestJS gateway at 3000 (not used)
- Run `npm install --legacy-peer-deps` for each service if deps break

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- DB schema: `services/*/prisma/schema.prisma`
- Frontend pages: `services/frontend/src/pages/`
