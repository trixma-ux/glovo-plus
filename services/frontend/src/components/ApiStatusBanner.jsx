import { useEffect, useState } from "react";
import { API_NOT_CONFIGURED_MESSAGE, API_UNREACHABLE_MESSAGE, checkApi } from "../api/api";

/** Bandeau global affiché quand l'API Gateway n'est pas configurée ou injoignable. */
export default function ApiStatusBanner() {
  const [status, setStatus] = useState("checking");
  const run = () => checkApi().then(setStatus);
  useEffect(() => {
    run();
  }, []);
  if (status === "checking" || status === "ok") return null;
  return (
    <div className="alert alert-warning rounded-0 mb-0 d-flex align-items-start gap-3" role="alert">
      <div className="flex-grow-1">
        <strong>{status === "not-configured" ? "Mode consultation : API non configurée" : "API indisponible"}</strong>
        <div className="small">{status === "not-configured" ? API_NOT_CONFIGURED_MESSAGE : API_UNREACHABLE_MESSAGE}</div>
      </div>
      {status === "unreachable" && (
        <button className="btn btn-sm btn-outline-dark" onClick={run}>
          Réessayer
        </button>
      )}
    </div>
  );
}
