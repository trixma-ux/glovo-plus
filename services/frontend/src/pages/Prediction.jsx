import { useState } from "react";
import Navbar from "../components/Navbar";
import ErrorAlert from "../components/ErrorAlert";
import api, { errorMessage } from "../api/api";

const fields = [
  ["distance", "Distance (km)", { min: 0.1, step: 0.1 }],
  ["traffic", "Trafic (1-5)", { min: 1, max: 5 }],
  ["weather", "Météo (1-5)", { min: 1, max: 5 }],
];

export default function Prediction() {
  const [form, setForm] = useState({ distance: 5, traffic: 3, weather: 1 });
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const r = await api.post("/ml/predict", { distance: Number(form.distance), traffic: Number(form.traffic), weather: Number(form.weather) });
      setResult(r.data.estimated_time);
    } catch (err) {
      setError(errorMessage(err, "Le ML Service n'a pas pu répondre."));
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="fw-bold mb-4">Prédiction du temps de livraison</h2>
        <ErrorAlert error={error} onClose={() => setError("")} />
        <div className="card shadow-sm">
          <div className="card-body">
            <form onSubmit={submit} className="row g-3">
              {fields.map(([n, label, attrs]) => (
                <div className="col-md-4" key={n}>
                  <label className="form-label">{label}</label>
                  <input name={n} type="number" className="form-control" value={form[n]} onChange={change} {...attrs} />
                </div>
              ))}
              <div><button className="btn btn-primary" disabled={loading}>{loading ? "Calcul..." : "Prédire"}</button></div>
            </form>
            {result != null && <div className="alert alert-success mt-4 mb-0">Temps estimé : <b>{result} minutes</b></div>}
          </div>
        </div>
      </div>
    </>
  );
}
