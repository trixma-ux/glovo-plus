# Instructions d'installation et d'utilisation

## Prérequis

Installez :

- Docker Desktop
- Node.js 20+ si vous voulez lancer le frontend hors Docker
- Git Bash ou PowerShell sous Windows

## Lancement recommandé

Dans le dossier racine du projet :

```bash
docker compose up --build
```

Attendez que les services soient lancés, puis ouvrez :

```txt
http://localhost:5173
```

## Tester les APIs

Swagger :

```txt
http://localhost:3000/api/docs
http://localhost:3001/api/docs
http://localhost:3002/api/docs
http://localhost:3003/api/docs
http://localhost:3004/api/docs
http://localhost:3005/docs
```

## Workflow de démonstration

1. Créer un compte dans l'interface.
2. Se connecter.
3. Aller dans Restaurants et créer un restaurant.
4. Aller dans Produits et créer un produit lié au restaurant.
5. Aller dans Commandes et créer une commande.
6. Aller dans Livraisons et créer une livraison.
7. Aller dans Prédiction ML et tester une estimation.
8. Arrêter `restaurant-service` puis tester une commande pour montrer la résilience.

## Commandes utiles

```bash
docker compose ps
docker compose logs -f api-gateway
docker compose logs -f order-service
docker stop restaurant-service
docker start restaurant-service
docker compose down -v
```

## Lancer seulement le frontend hors Docker

```bash
cd frontend
npm install
npm run dev
```

## Problème fréquent : port déjà occupé

Si un port est déjà utilisé, arrêtez les anciens conteneurs :

```bash
docker compose down
```

Puis relancez :

```bash
docker compose up --build
```
