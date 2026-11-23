import { statusBadgeClass, statusLabel } from "../utils/statusLabels";

/** Badge de statut en français. kind : "order" | "delivery". */
export default function StatusBadge({ kind, status }) {
  return <span className={`badge ${statusBadgeClass(kind, status)}`} title={status}>{statusLabel(kind, status)}</span>;
}
