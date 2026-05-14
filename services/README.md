# Smart Delivery Platform

Plateforme de livraison intelligente inspirée de Glovo / Uber Eats / Yango Deli, basée sur une architecture microservices.

## Stack

- API Gateway : NestJS, port 3000
- User Service : NestJS + PostgreSQL + Prisma + JWT, port 3001
- Restaurant Service : NestJS + PostgreSQL + Prisma, port 3002
- Order Service : NestJS + PostgreSQL + Prisma + REST inter-services + résilience, port 3003
- Delivery Service : NestJS + PostgreSQL + Prisma + ML Client, port 3004
- ML Service : FastAPI + scikit-learn, port 3005
- Frontend : React + Vite + Bootstrap, port 5173
- Docker Compose global

## Architecture

```txt
Client React → API Gateway → Microservices → Bases PostgreSQL séparées
                         ↘ ML Service FastAPI
```

Chaque microservice possède sa propre base de données, son propre conteneur, son propre port et sa propre responsabilité métier.

## Lancement complet

```bash
docker compose up --build
```

## Arrêt complet

```bash
docker compose down
```

## Réinitialisation totale avec suppression des données

```bash
docker compose down -v
docker compose up --build
```

## URLs

| Élément | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API Gateway Swagger | http://localhost:3000/api/docs |
| User Swagger | http://localhost:3001/api/docs |
| Restaurant Swagger | http://localhost:3002/api/docs |
| Order Swagger | http://localhost:3003/api/docs |
| Delivery Swagger | http://localhost:3004/api/docs |
| ML Swagger | http://localhost:3005/docs |

## Scénario de test conseillé

1. Ouvrir http://localhost:5173
2. Créer un compte client
3. Se connecter
4. Créer un restaurant
5. Créer un produit
6. Créer une commande
7. Créer une livraison
8. Tester la prédiction ML
9. Simuler une panne du Restaurant Service

## Simulation de panne

```bash
docker stop restaurant-service
```

Ensuite créer une commande. Le Order Service doit répondre avec une erreur propre.

Relancer :

```bash
docker start restaurant-service
```

## Endpoints principaux via Gateway

```txt
POST /api/users
POST /api/auth/login
GET  /api/restaurants
POST /api/restaurants
GET  /api/products
POST /api/products
GET  /api/orders
POST /api/orders
GET  /api/deliveries
POST /api/deliveries
POST /api/ml/predict
```

## Identifiants de démonstration

Créer un utilisateur via l'interface ou via Postman :

```json
{
  "fullName": "Kaba Ibrahim",
  "email": "ibrahim@example.com",
  "phone": "+2250700000000",
  "password": "Password123",
  "role": "CLIENT"
}
```

## Notes importantes

- Les migrations Prisma sont appliquées automatiquement avec `prisma db push` dans les conteneurs.
- Pour une production réelle, remplacer `db push` par des migrations versionnées.
- Le JWT est généré par le User Service.
- L'API Gateway relaie les requêtes vers les services internes Docker.
- Le ML Service utilise un modèle de régression simple entraîné au démarrage avec un dataset simulé.
