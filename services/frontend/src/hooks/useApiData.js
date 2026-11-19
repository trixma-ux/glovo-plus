import { useCallback, useEffect, useState } from "react";
import { errorMessage } from "../api/api";

/** Charge une ou plusieurs ressources de l'API et expose { data, loading, error, reload }. */
export default function useApiData(loader, initial) {
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await loader());
    } catch (err) {
      setError(errorMessage(err, "Impossible de charger les données."));
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    reload();
  }, [reload]);
  return { data, loading, error, setError, reload };
}
