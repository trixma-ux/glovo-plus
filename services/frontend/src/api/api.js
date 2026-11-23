import axios from "axios";

/**
 * URL de l'API Gateway.
 * - Développement / Docker : http://localhost:3000/api par défaut (docker-compose).
 * - Production (GitHub Pages) : définir VITE_API_URL au build, ex. https://gateway.exemple.com
 *   (le suffixe /api est ajouté s'il manque).
 */
const raw = String(import.meta.env.VITE_API_URL ?? "").trim().replace(/\/+$/, "");
const fallback = import.meta.env.DEV ? "http://localhost:3000/api" : "";

export const API_BASE_URL = raw ? (raw.endsWith("/api") ? raw : `${raw}/api`) : fallback;
export const API_CONFIGURED = API_BASE_URL !== "";

export const API_NOT_CONFIGURED_MESSAGE =
  "Aucune API n'est configurée pour cette version en ligne : la connexion et les données ne sont pas disponibles.";
export const API_UNREACHABLE_MESSAGE =
  "L'API Gateway est injoignable pour le moment. Vérifiez que les services sont démarrés puis réessayez.";

// 60 s : les services gratuits Render peuvent mettre ~30-60 s à se réveiller
const api = axios.create({ baseURL: API_BASE_URL || undefined, timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 60000) });

/**
 * Réveil des services gratuits Render : un service en veille n'est réveillé que par une
 * requête externe (navigateur), pas par la gateway. On demande donc à la gateway la liste
 * des services amont (GET /warmup) et on pinge leur /health depuis le navigateur.
 */
const GATEWAY_ROOT = API_BASE_URL.replace(/\/api$/, "");
let lastWake = 0;
export function wakeServices() {
  if (!API_CONFIGURED || Date.now() - lastWake < 20000) return;
  lastWake = Date.now();
  axios
    .get(`${GATEWAY_ROOT}/warmup`, { timeout: 60000 })
    .then(({ data }) => {
      for (const u of data?.upstreams || []) fetch(u.health, { mode: "no-cors", cache: "no-store" }).catch(() => {});
    })
    .catch(() => {});
}
if (typeof window !== "undefined") wakeServices();

api.interceptors.request.use((config) => {
  if (!API_CONFIGURED) {
    return Promise.reject(Object.assign(new Error(API_NOT_CONFIGURED_MESSAGE), { notConfigured: true }));
  }
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 503 { waking: true } : le service amont démarre (la requête ne l'a pas atteint) -> on relance le réveil et on rejoue, jusqu'à ~90 s
const MAX_WAKE_RETRIES = 6;
api.interceptors.response.use(undefined, async (err) => {
  const cfg = err.config;
  if (!cfg || err.response?.status !== 503 || !err.response?.data?.waking) throw err;
  cfg.__wakeRetry = (cfg.__wakeRetry || 0) + 1;
  if (cfg.__wakeRetry > MAX_WAKE_RETRIES) throw err;
  wakeServices();
  const wait = Math.min(Number(err.response.headers?.["retry-after"]) || 5, 15) * 1000;
  await new Promise((r) => setTimeout(r, wait));
  return api(cfg);
});

/** Transforme une erreur axios / service en message lisible pour l'utilisateur. */
export function errorMessage(err, fallbackMessage = "Une erreur est survenue.") {
  if (!err) return fallbackMessage;
  if (err.notConfigured) return API_NOT_CONFIGURED_MESSAGE;
  if (!err.response) {
    if (err.code === "ECONNABORTED") return "Le serveur met trop de temps à répondre (délai dépassé).";
    return API_UNREACHABLE_MESSAGE;
  }
  const data = err.response.data;
  const pick = (d) => {
    if (!d) return null;
    if (typeof d === "string") return d;
    if (Array.isArray(d.message)) return d.message.join(", ");
    if (typeof d.message === "string" && d.message !== "Erreur API Gateway") return d.message;
    return pick(d.detail);
  };
  const msg = pick(data);
  if (msg) return msg;
  if (err.response.status === 401) return "Session expirée ou identifiants invalides.";
  if (err.response.status >= 500) return "Un service est indisponible. Réessayez dans un instant.";
  return fallbackMessage;
}

/** Vérifie que l'API Gateway répond (n'importe quelle réponse HTTP = joignable). */
export async function checkApi() {
  if (!API_CONFIGURED) return "not-configured";
  try {
    await axios.get(`${API_BASE_URL}/restaurants`, { timeout: 5000 });
    return "ok";
  } catch (err) {
    return err.response ? "ok" : "unreachable";
  }
}

export default api;
