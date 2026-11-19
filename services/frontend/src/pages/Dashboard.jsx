import Navbar from "../components/Navbar";
import ErrorAlert from "../components/ErrorAlert";
import api from "../api/api";
import useApiData from "../hooks/useApiData";

const cards = [
  ["restaurants", "Restaurants", "bg-primary"],
  ["products", "Produits", "bg-success"],
  ["orders", "Commandes", "bg-warning"],
  ["deliveries", "Livraisons", "bg-danger"],
];

export default function Dashboard() {
  // Chaque service est interrogé séparément : une panne n'empêche pas d'afficher les autres.
  const { data, loading, error } = useApiData(async () => {
    const results = await Promise.allSettled(cards.map(([key]) => api.get(`/${key}`)));
    const stats = {};
    const down = [];
    results.forEach((r, i) => {
      const [key, label] = cards[i];
      if (r.status === "fulfilled") stats[key] = r.value.data.length;
      else down.push(label);
    });
    if (down.length === cards.length) throw results[0].reason;
    return { stats, down };
  }, { stats: {}, down: [] });

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h2 className="fw-bold mb-4">Tableau de bord</h2>
        <ErrorAlert error={error} />
        {data.down.length > 0 && (
          <div className="alert alert-warning">Service(s) indisponible(s) : {data.down.join(", ")}.</div>
        )}
        <div className="row g-4">
          {cards.map(([key, label, color]) => (
            <div className="col-6 col-md-3" key={key}>
              <div className={`stat-card ${color}`}>
                <h3>{loading ? "…" : data.stats[key] ?? "—"}</h3>
                <p>{label}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="card mt-4 shadow-sm">
          <div className="card-body">
            <h5 className="fw-bold">Architecture</h5>
            <p className="mb-0">Frontend React → API Gateway → microservices Utilisateurs, Restaurants, Commandes, Livraisons (NestJS) et ML (FastAPI), chacun avec sa propre base PostgreSQL.</p>
          </div>
        </div>
      </div>
    </>
  );
}
