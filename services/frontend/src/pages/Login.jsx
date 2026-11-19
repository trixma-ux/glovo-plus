import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { errorMessage } from "../api/api";
import ErrorAlert from "../components/ErrorAlert";
import { ValidatedForm, FieldError } from "../components/ValidatedForm";

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await api.post("/auth/login", form);
      localStorage.setItem("access_token", r.data.access_token);
      localStorage.setItem("user", JSON.stringify(r.data.user));
      nav("/dashboard");
    } catch (err) {
      setError(err.response?.status === 401 ? "Email ou mot de passe incorrect." : errorMessage(err, "Connexion impossible."));
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-card shadow">
        <h2 className="fw-bold text-center mb-1">Connexion</h2>
        <p className="text-muted text-center">Accédez à Glovo Plus</p>
        <ErrorAlert error={error} />
        <ValidatedForm onValidSubmit={submit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-control" value={form.email} onChange={change} required /><FieldError name="email" />
          </div>
          <div className="mb-3">
            <label className="form-label">Mot de passe</label>
            <input name="password" type="password" className="form-control" value={form.password} onChange={change} required /><FieldError name="password" />
          </div>
          <button className="btn btn-primary w-100" disabled={loading}>{loading ? "Connexion..." : "Se connecter"}</button>
        </ValidatedForm>
        <p className="mt-3 text-center">Pas de compte ? <Link to="/register">Créer un compte</Link></p>
      </div>
    </div>
  );
}
