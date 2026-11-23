/**
 * Services amont (URL publiques Render) et gestion du réveil des services gratuits.
 *
 * Constat en production (23/11/2026) : quand un service gratuit Render est en veille,
 * l'edge Render répond « 429 Too Many Requests » (texte brut) aux appels venant d'un
 * autre service Render (la gateway) et ne le réveille pas. Seule une requête externe
 * (navigateur, curl) le réveille. D'où :
 *  - un 429/502/503/504 non-JSON = réponse de l'edge Render, pas de l'application : la
 *    requête n'a pas atteint le service, on peut la rejouer sans risque ;
 *  - la gateway rejoue quelques secondes puis renvoie 503 { waking: true } + Retry-After ;
 *  - GET /warmup donne au front la liste des services à réveiller depuis le navigateur ;
 *  - tant que la gateway reçoit du trafic, elle pinge les services toutes les 10 min.
 */
export type Upstream = { name: string; url: string };

export function upstreams(): Upstream[] {
  const list: Upstream[] = [
    { name: 'user-service', url: process.env.USER_SERVICE_URL || '' },
    { name: 'restaurant-service', url: process.env.RESTAURANT_SERVICE_URL || '' },
    { name: 'order-service', url: process.env.ORDER_SERVICE_URL || '' },
    { name: 'delivery-service', url: process.env.DELIVERY_SERVICE_URL || '' },
    { name: 'ml-service', url: process.env.ML_SERVICE_URL || '' },
  ];
  return list.filter((u) => u.url).map((u) => ({ ...u, url: u.url.replace(/\/+$/, '') }));
}

/** true si la réponse vient de l'edge Render (service en veille / en démarrage), pas de l'app. */
export function isEdgeUnavailable(status: number | undefined, headers: any): boolean {
  if (!status || ![429, 502, 503, 504].includes(status)) return false;
  const ct = String(headers?.['content-type'] || '');
  return !ct.includes('application/json');
}

let lastTraffic = 0;
export function markTraffic() { lastTraffic = Date.now(); }

/** Pinge /health des services amont toutes les 10 min tant que la gateway a reçu du trafic depuis moins de 15 min. */
export function startKeepWarm(fetchHealth: (url: string) => Promise<unknown>) {
  const every = Number(process.env.KEEP_WARM_INTERVAL_MS || 10 * 60 * 1000);
  if (!every) return;
  const ping = () => { for (const u of upstreams()) fetchHealth(`${u.url}/health`).catch(() => undefined); };
  ping();
  setInterval(() => { if (Date.now() - lastTraffic < 15 * 60 * 1000) ping(); }, every).unref();
}
