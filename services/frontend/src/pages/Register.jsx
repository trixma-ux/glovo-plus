import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api/api";
import ErrorAlert from "../components/ErrorAlert";
import { ValidatedForm, FieldError } from "../components/ValidatedForm";

const fields = [
  ["fullName", "Nom complet", "text", true],
  ["email", "Email", "email", true],
  ["phone", "Téléphone", "tel", false],
  ["password", "Mot de passe (6 caractères min.)", "password", true],
];

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", role: "CLIENT" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/users", { ...form, phone: form.phone || undefined });
      nav("/login");
    } catch (err) {
      setError(errorMessage(err, "Impossible de créer le compte."));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-card shadow">
        <h2 className="fw-bold text-center mb-3">Inscription</h2>
        <ErrorAlert error={error} />
        <ValidatedForm onValidSubmit={submit}>
          {fields.map(([name, label, type, required]) => (
            <div className="mb-3" key={name}>
              <label className="form-label">{label}</label>
              <input name={name} type={type} className="form-control" value={form[name]} onChange={change} required={required} minLength={name === "password" ? 6 : undefined} /><FieldError name={name} />
            </div>
          ))}
          <div className="mb-3">
            <label className="form-label">Rôle</label>
            <select name="role" className="form-select" value={form.role} onChange={change}>
              <option value="CLIENT">Client</option>
              <option value="LIVREUR">Livreur</option>
            </select><FieldError name="role" />
          </div>
          <button className="btn btn-success w-100" disabled={loading}>{loading ? "Création..." : "Créer mon compte"}</button>
        </ValidatedForm>
        <p className="mt-3 text-center">Déjà inscrit ? <Link to="/login">Connexion</Link></p>
      </div>
    </div>
  );
}
