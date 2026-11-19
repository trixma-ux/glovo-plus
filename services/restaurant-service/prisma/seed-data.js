/**
 * Données de démonstration (Abidjan) — identifiants fixes pour un seed idempotent.
 * Prix en FCFA. Téléphones fictifs (démo).
 */
const R = (n) => `11111111-0000-4000-8000-${String(n).padStart(12, '0')}`;
const P = (n) => `22222222-0000-4000-8000-${String(n).padStart(12, '0')}`;

const restaurants = [
  {
    id: R(1),
    name: 'Maquis Chez Tantie Awa',
    description: 'Maquis ivoirien traditionnel — kedjenou, foutou, placali (démo)',
    address: 'Rue des Jardins, Deux-Plateaux, Cocody, Abidjan',
    phone: '+225 27 22 00 00 01',
    isOpen: true,
    products: [
      { id: P(101), name: 'Kedjenou de poulet', description: 'Poulet mijoté à l’étouffée, servi avec attiéké', price: 4500 },
      { id: P(102), name: 'Foutou sauce graine', description: 'Foutou banane, sauce graine au poisson fumé', price: 3500 },
      { id: P(103), name: 'Placali sauce kopè', description: 'Placali et sauce gombo (kopè) à la viande', price: 3000 },
      { id: P(104), name: 'Poisson braisé attiéké', description: 'Carpe braisée, attiéké, oignons et piment', price: 5000 },
      { id: P(105), name: 'Bissap (50 cl)', description: 'Jus de fleurs d’hibiscus frais', price: 500 },
    ],
  },
  {
    id: R(2),
    name: 'Garba Choco Yopougon',
    description: 'Attiéké et garba à toute heure (démo)',
    address: 'Carrefour Selmer, Yopougon, Abidjan',
    phone: '+225 27 23 00 00 02',
    isOpen: true,
    products: [
      { id: P(201), name: 'Garba', description: 'Attiéké, thon frit, piment et oignons', price: 1000 },
      { id: P(202), name: 'Garba spécial', description: 'Double thon, œuf dur et alloco', price: 1500 },
      { id: P(203), name: 'Attiéké poisson', description: 'Attiéké et carpe frite', price: 2500 },
      { id: P(204), name: 'Attiéké poulet', description: 'Attiéké et poulet braisé', price: 2000 },
      { id: P(205), name: 'Gnamakoudji (33 cl)', description: 'Jus de gingembre maison', price: 500 },
    ],
  },
  {
    id: R(3),
    name: 'Alloco Grill Marcory',
    description: 'Alloco, brochettes et grillades (démo)',
    address: 'Boulevard Valéry Giscard d’Estaing, Zone 4, Marcory, Abidjan',
    phone: '+225 27 21 00 00 03',
    isOpen: true,
    products: [
      { id: P(301), name: 'Alloco poisson', description: 'Banane plantain frite et poisson braisé', price: 2500 },
      { id: P(302), name: 'Alloco poulet braisé', description: 'Alloco et demi-poulet braisé', price: 3000 },
      { id: P(303), name: 'Brochettes de bœuf (x5)', description: 'Brochettes grillées, oignons, piment', price: 2000 },
      { id: P(304), name: 'Alloco simple', description: 'Portion d’alloco et sauce pimentée', price: 1000 },
      { id: P(305), name: 'Bissap (50 cl)', description: 'Jus de fleurs d’hibiscus frais', price: 500 },
    ],
  },
  {
    id: R(4),
    name: 'Pâtisserie du Plateau',
    description: 'Viennoiseries, gâteaux et jus locaux (démo)',
    address: 'Avenue Chardy, Plateau, Abidjan',
    phone: '+225 27 20 00 00 04',
    isOpen: true,
    products: [
      { id: P(401), name: 'Croissant', description: 'Croissant pur beurre', price: 500 },
      { id: P(402), name: 'Pain au chocolat', description: 'Viennoiserie au chocolat', price: 600 },
      { id: P(403), name: 'Gâteau coco', description: 'Part de gâteau à la noix de coco', price: 1500 },
      { id: P(404), name: 'Beignets gbofloto (x5)', description: 'Beignets ivoiriens sucrés', price: 500 },
      { id: P(405), name: 'Jus de gnamakoudji (50 cl)', description: 'Gingembre, citron et ananas', price: 1000 },
    ],
  },
];

module.exports = { restaurants };
