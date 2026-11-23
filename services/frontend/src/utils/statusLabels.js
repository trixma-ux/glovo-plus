/**
 * Libellés français et couleurs des statuts renvoyés par l'API (valeurs brutes inchangées côté backend).
 * Source unique pour tout affichage de statut : commandes (order-service) et livraisons (delivery-service).
 */
export const DELIVERY_STATUS = {
  EN_ATTENTE: { label: "En attente", badge: "bg-secondary" },
  EN_COURS: { label: "En cours", badge: "bg-warning text-dark" },
  LIVRE: { label: "Livré", badge: "bg-success" },
};

export const ORDER_STATUS = {
  EN_ATTENTE: { label: "En attente", badge: "bg-secondary" },
  VALIDEE: { label: "Validée", badge: "bg-primary" },
  PREPARATION: { label: "En préparation", badge: "bg-info text-dark" },
  LIVRAISON: { label: "En livraison", badge: "bg-warning text-dark" },
  LIVREE: { label: "Livrée", badge: "bg-success" },
};

const MAPS = { order: ORDER_STATUS, delivery: DELIVERY_STATUS };

/** Libellé lisible d'un statut ; repli : « EN_ATTENTE » → « En attente ». */
export function statusLabel(kind, status) {
  if (!status) return "—";
  const known = MAPS[kind]?.[status];
  if (known) return known.label;
  const s = String(status).replace(/_/g, " ").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function statusBadgeClass(kind, status) {
  return MAPS[kind]?.[status]?.badge ?? "bg-secondary";
}
