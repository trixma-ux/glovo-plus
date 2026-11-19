import { useState } from "react";
import Navbar from "../components/Navbar";
import ErrorAlert from "../components/ErrorAlert";
import api, { errorMessage } from "../api/api";
import useApiData from "../hooks/useApiData";
import { ValidatedForm, FieldError } from "../components/ValidatedForm";

const empty = { name: "", description: "", price: "", imageUrl: "", isAvailable: true, restaurantId: "" };

export default function Products() {
  const { data, loading, error, setError, reload } = useApiData(async () => {
    const [p, r] = await Promise.all([api.get("/products"), api.get("/restaurants")]);
    return { products: p.data, restaurants: r.data };
  }, { products: [], restaurants: [] });
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const isAdmin = JSON.parse(localStorage.getItem("user") || "{}").role === "ADMIN";
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/products", { ...form, price: Number(form.price), imageUrl: form.imageUrl || undefined });
      setForm(empty);
      reload();
    } catch (err) {
      setError(errorMessage(err, "Impossible d'enregistrer le produit."));
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="fw-bold mb-4">Produits</h2>
        <ErrorAlert error={error} onClose={() => setError("")} />
        {isAdmin && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <ValidatedForm onValidSubmit={submit} className="row g-3">
              <div className="col-md-6"><input name="name" className="form-control" placeholder="Nom" value={form.name} onChange={change} required /><FieldError name="name" /></div>
              <div className="col-md-3"><input name="price" type="number" min="0" className="form-control" placeholder="Prix (FCFA)" value={form.price} onChange={change} required /><FieldError name="price" /></div>
              <div className="col-md-3">
                <select name="restaurantId" className="form-select" value={form.restaurantId} onChange={change} required>
                  <option value="">Restaurant</option>
                  {data.restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select><FieldError name="restaurantId" />
              </div>
              <div className="col-md-12"><input name="description" className="form-control" placeholder="Description" value={form.description} onChange={change} /><FieldError name="description" /></div>
              <div className="col-12 form-check ms-2">
                <input id="isAvailable" name="isAvailable" type="checkbox" className="form-check-input" checked={form.isAvailable} onChange={change} />
                <label htmlFor="isAvailable" className="form-check-label">Disponible</label>
              </div>
              <div><button className="btn btn-primary" disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer"}</button></div>
            </ValidatedForm>
          </div>
        </div>
        )}
        {loading && <p className="text-muted">Chargement...</p>}
        {!loading && data.products.length === 0 && <p className="text-muted">Aucun produit.</p>}
        <div className="row g-4">
          {data.products.map((p) => (
            <div className="col-md-4" key={p.id}>
              <div className="card product-card shadow-sm">
                <div className="card-body">
                  <h5 className="fw-bold">{p.name}</h5>
                  <p className="text-muted">{p.description}</p>
                  <p className="fw-bold">{p.price} FCFA</p>
                  <p>Restaurant : <b>{p.restaurant?.name ?? data.restaurants.find((r) => r.id === p.restaurantId)?.name ?? "—"}</b></p>
                  <span className={`badge ${p.isAvailable ? "bg-success" : "bg-danger"}`}>{p.isAvailable ? "Disponible" : "Indisponible"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
