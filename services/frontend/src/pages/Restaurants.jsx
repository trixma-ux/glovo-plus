import { useState } from "react";
import Navbar from "../components/Navbar";
import ErrorAlert from "../components/ErrorAlert";
import api, { errorMessage } from "../api/api";
import useApiData from "../hooks/useApiData";

const empty = { name: "", description: "", address: "", phone: "", isOpen: true };

export default function Restaurants() {
  const { data: items, loading, error, setError, reload } = useApiData(async () => (await api.get("/restaurants")).data, []);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/restaurants", form);
      setForm(empty);
      reload();
    } catch (err) {
      setError(errorMessage(err, "Impossible d'enregistrer le restaurant."));
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="fw-bold mb-4">Restaurants</h2>
        <ErrorAlert error={error} onClose={() => setError("")} />
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <form onSubmit={submit} className="row g-3">
              <div className="col-md-6"><input name="name" className="form-control" placeholder="Nom" value={form.name} onChange={change} required /></div>
              <div className="col-md-6"><input name="address" className="form-control" placeholder="Adresse" value={form.address} onChange={change} required /></div>
              <div className="col-md-6"><input name="phone" className="form-control" placeholder="Téléphone" value={form.phone} onChange={change} /></div>
              <div className="col-md-6"><input name="description" className="form-control" placeholder="Description" value={form.description} onChange={change} /></div>
              <div className="col-12 form-check ms-2">
                <input id="isOpen" name="isOpen" type="checkbox" className="form-check-input" checked={form.isOpen} onChange={change} />
                <label htmlFor="isOpen" className="form-check-label">Ouvert</label>
              </div>
              <div><button className="btn btn-primary" disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</button></div>
            </form>
          </div>
        </div>
        <div className="card shadow-sm">
          <div className="card-body table-responsive">
            <table className="table table-hover">
              <thead><tr><th>Nom</th><th>Adresse</th><th>Téléphone</th><th>Statut</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan="4" className="text-muted">Chargement...</td></tr>}
                {!loading && items.length === 0 && <tr><td colSpan="4" className="text-muted">Aucun restaurant.</td></tr>}
                {items.map((r) => (
                  <tr key={r.id}>
                    <td>{r.name}</td><td>{r.address}</td><td>{r.phone}</td>
                    <td><span className={`badge ${r.isOpen ? "bg-success" : "bg-secondary"}`}>{r.isOpen ? "Ouvert" : "Fermé"}</span></td>
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
