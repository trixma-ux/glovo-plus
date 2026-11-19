import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";

const links = [
  ["/restaurants", "Restaurants"],
  ["/products", "Produits"],
  ["/orders", "Commandes"],
  ["/deliveries", "Livraisons"],
  ["/users", "Utilisateurs"],
  ["/prediction", "Prédiction ML"],
];

export default function Navbar() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    nav("/login");
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand fw-bold" to="/dashboard">
        Glovo Plus
      </Link>
      <button className="navbar-toggler" type="button" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>
        <span className="navbar-toggler-icon" />
      </button>
      <div className={`collapse navbar-collapse ${open ? "show" : ""}`}>
        <ul className="navbar-nav me-auto">
          {links.map(([to, label]) => (
            <li className="nav-item" key={to}>
              <NavLink className="nav-link" to={to} onClick={() => setOpen(false)}>
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <span className="text-light me-3">
          {user.fullName || "Utilisateur"}
          {user.role && <span className="badge bg-secondary ms-2">{user.role}</span>}
        </span>
        <button className="btn btn-outline-light btn-sm" onClick={logout}>
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
