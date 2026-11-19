export default function ErrorAlert({ error, onClose }) {
  if (!error) return null;
  return (
    <div className="alert alert-danger d-flex justify-content-between align-items-start" role="alert">
      <span>{error}</span>
      {onClose && <button type="button" className="btn-close" aria-label="Fermer" onClick={onClose} />}
    </div>
  );
}
