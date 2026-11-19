import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import ErrorAlert from "../components/ErrorAlert";
import api, { errorMessage } from "../api/api";
import useApiData from "../hooks/useApiData";
import { ValidatedForm, FieldError } from "../components/ValidatedForm";

/**
 * Création de commande (spec §4c) : un utilisateur + une liste de produits d'un restaurant.
 * Le total définitif est calculé par l'Order Service, qui interroge les services
 * Utilisateurs et Restaurants ; en cas de panne, son message d'erreur est affiché tel quel.
 */
export default function Orders() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { data, loading, error, setError, reload } = useApiData(async () => {
    const [o, p, r] = await Promise.allSettled([api.get("/orders"), api.get("/products"), api.get("/restaurants")]);
    if (o.status === "rejected") throw o.reason;
    return {
      orders: o.value.data,
      products: p.status === "fulfilled" ? p.value.data : [],
      restaurants: r.status === "fulfilled" ? r.value.data : [],
      catalogError: p.status === "rejected" ? errorMessage(p.reason) : "",
    };
  }, { orders: [], products: [], restaurants: [], catalogError: "" });

  const [restaurantId, setRestaurantId] = useState("");
  const [lines, setLines] = useState([{ productId: "", quantity: 1 }]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  const menu = data.products.filter((p) => p.isAvailable && p.restaurantId === restaurantId);
  const estimate = useMemo(
    () => lines.reduce((sum, l) => sum + (menu.find((p) => p.id === l.productId)?.price ?? 0) * Number(l.quantity || 0), 0),
    [lines, menu],
  );
  const setLine = (i, patch) => setLines(lines.map((l, j) => (j === i ? { ...l, ...patch } : l)));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const items = lines.filter((l) => l.productId).map((l) => ({ productId: l.productId, quantity: Number(l.quantity) }));
    if (!user.id) return setError("Reconnectez-vous : utilisateur inconnu.");
    if (items.length === 0) return setError("Ajoutez au moins un produit.");
    setSaving(true);
    try {
      const r = await api.post("/orders", { userId: user.id, restaurantId, items });
      setSuccess(`Commande créée — total calculé par le service : ${r.data.totalAmount} FCFA.`);
      setLines([{ productId: "", quantity: 1 }]);
      reload();
    } catch (err) {
      setError(errorMessage(err, "La commande n'a pas pu être créée."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="fw-bold mb-4">Commandes</h2>
        <ErrorAlert error={error} onClose={() => setError("")} />
        {data.catalogError && <div className="alert alert-warning">Catalogue indisponible : {data.catalogError}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <ValidatedForm onValidSubmit={submit} className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Restaurant</label>
                <select name="restaurantId" className="form-select" value={restaurantId} onChange={(e) => { setRestaurantId(e.target.value); setLines([{ productId: "", quantity: 1 }]); }} required>
                  <option value="">Choisir un restaurant</option>
                  {data.restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
                <FieldError name="restaurantId" />
              </div>
              <div className="col-12">
                {lines.map((l, i) => (
                  <div className="row g-2 mb-2" key={i}>
                    <div className="col-7">
                      <select className="form-select" value={l.productId} onChange={(e) => setLine(i, { productId: e.target.value })} disabled={!restaurantId}>
                        <option value="">Produit</option>
                        {menu.map((p) => <option key={p.id} value={p.id}>{p.name} — {p.price} FCFA</option>)}
                      </select>
                    </div>
                    <div className="col-3"><input name={`quantity-${i}`} type="number" min="1" step="1" required className="form-control" value={l.quantity} onChange={(e) => setLine(i, { quantity: e.target.value })} /><FieldError name={`quantity-${i}`} /></div>
                    <div className="col-2">
                      <button type="button" className="btn btn-outline-danger w-100" onClick={() => setLines(lines.length > 1 ? lines.filter((_, j) => j !== i) : lines)} aria-label="Retirer">×</button>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setLines([...lines, { productId: "", quantity: 1 }])} disabled={!restaurantId}>+ Ajouter un produit</button>
              </div>
              <div className="col-12 d-flex align-items-center gap-3">
                <button className="btn btn-primary" disabled={saving}>{saving ? "Envoi..." : "Commander"}</button>
                <span className="text-muted">Total estimé : <b>{estimate} FCFA</b></span>
              </div>
            </ValidatedForm>
          </div>
        </div>
        <div className="card shadow-sm">
          <div className="card-body table-responsive">
            <table className="table">
              <thead><tr><th>ID</th><th>Total</th><th>Statut</th><th>Produits</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan="4" className="text-muted">Chargement...</td></tr>}
                {!loading && data.orders.length === 0 && <tr><td colSpan="4" className="text-muted">Aucune commande.</td></tr>}
                {data.orders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id.slice(0, 8)}…</td>
                    <td>{o.totalAmount} FCFA</td>
                    <td><span className="badge bg-info">{o.status}</span></td>
                    <td>{o.items?.map((i) => <div key={i.id}>{i.productName} × {i.quantity}</div>)}</td>
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
