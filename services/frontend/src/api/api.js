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

const api = axios.create({ baseURL: API_BASE_URL || undefined, timeout: 8000 });

api.interceptors.request.use((config) => {
  if (!API_CONFIGURED) {
    return Promise.reject(Object.assign(new Error(API_NOT_CONFIGURED_MESSAGE), { notConfigured: true }));
  }
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
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
