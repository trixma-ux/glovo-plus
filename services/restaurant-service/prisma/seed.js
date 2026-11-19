/**
 * Seed de démonstration idempotent (restaurants + produits d'Abidjan).
 * Usage : DATABASE_URL=... npm run seed
 * Upsert par identifiant fixe : relancer le script ne crée pas de doublons et
 * remet les fiches de démo à leurs valeurs d'origine. Les autres données ne sont pas touchées.
 */
const { PrismaClient } = require('@prisma/client');
const { restaurants } = require('./seed-data');

async function main() {
  const prisma = new PrismaClient();
  try {
    let nProducts = 0;
    for (const { products, ...r } of restaurants) {
      await prisma.restaurant.upsert({ where: { id: r.id }, create: r, update: r });
      for (const p of products) {
        const data = { ...p, isAvailable: true, restaurantId: r.id };
        await prisma.product.upsert({ where: { id: p.id }, create: data, update: data });
        nProducts++;
      }
    }
    console.log(`Seed OK : ${restaurants.length} restaurants, ${nProducts} produits.`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
