import { useState } from "react";
import Navbar from "../components/Navbar";
import ErrorAlert from "../components/ErrorAlert";
import api, { errorMessage } from "../api/api";
import useApiData from "../hooks/useApiData";

const STATUS = { EN_ATTENTE: "bg-secondary", EN_COURS: "bg-warning text-dark", LIVRE: "bg-success" };
const LABEL = { EN_ATTENTE: "En attente", EN_COURS: "En cours", LIVRE: "Livré" };

/** Livraisons (spec §4d) : assigner un livreur, suivre le statut EN_ATTENTE → EN_COURS → LIVRE. */
export default function Deliveries() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { data, loading, error, setError, reload } = useApiData(async () => {
    const [d, o, u] = await Promise.allSettled([api.get("/deliveries"), api.get("/orders"), api.get("/users")]);
    if (d.status === "rejected") throw d.reason;
    return {
      deliveries: d.value.data,
      orders: o.status === "fulfilled" ? o.value.data : [],
      couriers: u.status === "fulfilled" ? u.value.data.filter((x) => x.role === "LIVREUR") : [],
    };
  }, { deliveries: [], orders: [], couriers: [] });
  const [form, setForm] = useState({ orderId: "", deliveryPersonId: "", distance: 5, traffic: 3, weather: 1 });
  const [saving, setSaving] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const courierName = (id) => data.couriers.find((c) => c.id === id)?.fullName ?? `${id.slice(0, 8)}…`;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      await api.post("/deliveries", {
        orderId: form.orderId,
        deliveryPersonId: form.deliveryPersonId || user.id,
        distance: Number(form.distance),
        traffic: Number(form.traffic),
        weather: Number(form.weather),
      });
      setForm({ orderId: "", deliveryPersonId: "", distance: 5, traffic: 3, weather: 1 });
      reload();
    } catch (err) {
      setError(errorMessage(err, "Impossible d'assigner la livraison."));
    } finally {
      setSaving(false);
    }
  };
  const setStatus = async (id, status) => {
    setError("");
    try {
      await api.patch(`/deliveries/${id}/status`, { status });
      reload();
    } catch (err) {
      setError(errorMessage(err, "Impossible de changer le statut."));
    }
  };

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="fw-bold mb-4">Livraisons</h2>
        <ErrorAlert error={error} onClose={() => setError("")} />
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <form onSubmit={submit} className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label">Commande</label>
                <select name="orderId" className="form-select" value={form.orderId} onChange={change} required>
                  <option value="">Choisir</option>
                  {data.orders.map((o) => <option key={o.id} value={o.id}>{o.id.slice(0, 8)} — {o.totalAmount} FCFA</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Livreur</label>
                <select name="deliveryPersonId" className="form-select" value={form.deliveryPersonId} onChange={change} required={data.couriers.length > 0}>
                  <option value="">{data.couriers.length ? "Choisir un livreur" : "Moi-même"}</option>
                  {data.couriers.map((c) => <option key={c.id} value={c.id}>{c.fullName}</option>)}
                </select>
              </div>
              <div className="col-md-2"><label className="form-label">Distance (km)</label><input name="distance" type="number" min="0.1" step="0.1" className="form-control" value={form.distance} onChange={change} /></div>
              <div className="col-md-1"><label className="form-label">Trafic</label><input name="traffic" type="number" min="1" max="5" className="form-control" value={form.traffic} onChange={change} /></div>
              <div className="col-md-1"><label className="form-label">Météo</label><input name="weather" type="number" min="1" max="5" className="form-control" value={form.weather} onChange={change} /></div>
              <div className="col-md-2"><button className="btn btn-primary w-100" disabled={saving}>{saving ? "..." : "Assigner"}</button></div>
            </form>
            <p className="small text-muted mt-2 mb-0">Trafic et météo : 1 (faible) à 5 (fort). Le temps estimé est calculé par le ML Service.</p>
          </div>
        </div>
        <div className="card shadow-sm">
          <div className="card-body table-responsive">
            <table className="table">
              <thead><tr><th>Commande</th><th>Livreur</th><th>Temps estimé</th><th>Statut</th><th>Action</th></tr></thead>
              <tbody>
                {loading && <tr><td colSpan="5" className="text-muted">Chargement...</td></tr>}
                {!loading && data.deliveries.length === 0 && <tr><td colSpan="5" className="text-muted">Aucune livraison.</td></tr>}
                {data.deliveries.map((d) => (
                  <tr key={d.id}>
                    <td>{d.orderId.slice(0, 8)}…</td>
                    <td>{courierName(d.deliveryPersonId)}</td>
                    <td>{d.estimatedTime ? `${d.estimatedTime} min` : "N/A"}</td>
                    <td><span className={`badge ${STATUS[d.status] ?? "bg-secondary"}`}>{LABEL[d.status] ?? d.status}</span></td>
                    <td className="text-nowrap">
                      <button className="btn btn-sm btn-outline-primary me-2" disabled={d.status !== "EN_ATTENTE"} onClick={() => setStatus(d.id, "EN_COURS")}>En cours</button>
                      <button className="btn btn-sm btn-outline-success" disabled={d.status === "LIVRE"} onClick={() => setStatus(d.id, "LIVRE")}>Livré</button>
                    </td>
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
