import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-card shadow text-center">
        <h2 className="fw-bold">Page introuvable</h2>
        <p className="text-muted">Cette page n'existe pas.</p>
        <Link className="btn btn-primary" to="/dashboard">Retour au tableau de bord</Link>
      </div>
    </div>
  );
}
