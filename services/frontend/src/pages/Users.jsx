import { useState } from "react";
import Navbar from "../components/Navbar";
import ErrorAlert from "../components/ErrorAlert";
import api, { errorMessage } from "../api/api";
import useApiData from "../hooks/useApiData";
import { ValidatedForm, FieldError } from "../components/ValidatedForm";

/** Utilisateurs (spec §4a) : lister et récupérer un utilisateur par identifiant. */
export default function Users() {
  const { data: users, loading, error, setError } = useApiData(async () => (await api.get("/users")).data, []);
  const [lookupId, setLookupId] = useState("");
  const [found, setFound] = useState(null);
  const lookup = async (e) => {
    e.preventDefault();
    setError("");
    setFound(null);
    try {
      setFound((await api.get(`/users/${encodeURIComponent(lookupId.trim())}`)).data);
    } catch (err) {
      setError(err.response?.status === 404 ? "Utilisateur introuvable." : errorMessage(err, "Recherche impossible."));
    }
  };
  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="fw-bold mb-4">Utilisateurs</h2>
        <ErrorAlert error={error} onClose={() => setError("")} />
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <ValidatedForm onValidSubmit={lookup} className="row g-2">
              <div className="col-md-9"><input name="userId" className="form-control" placeholder="Identifiant utilisateur (UUID)" value={lookupId} onChange={(e) => setLookupId(e.target.value)} required /><FieldError name="userId" /></div>
              <div className="col-md-3"><button className="btn btn-primary w-100">Récupérer</button></div>
            </ValidatedForm>
            {found && (
              <div className="alert alert-info mt-3 mb-0">
                <b>{found.fullName}</b> — {found.email} — {found.phone || "sans téléphone"} — <span className="badge bg-secondary">{found.role}</span>
              </div>
            )}
          </div>
        </div>
        <div className="card shadow-sm">
          <div className="card-body table-responsive">
            <table className="table">
              <thead><tr><th>Nom</th><th>Email</th><th>Téléphone</th><th>Rôle</th><th>ID</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan="5" className="text-muted">Chargement...</td></tr>}
                {!loading && users.length === 0 && <tr><td colSpan="5" className="text-muted">Aucun utilisateur.</td></tr>}
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>{u.fullName}</td><td>{u.email}</td><td>{u.phone}</td>
                    <td><span className="badge bg-secondary">{u.role}</span></td>
                    <td><code className="small">{u.id}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
