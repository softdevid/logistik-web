import { useEffect, useState } from "react";

export default function useReportData({ seedRows = [], endpoint, mapRow } = {}) {
  const [rows, setRows] = useState(seedRows);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!endpoint) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error("gagal memuat laporan");
        const body = await response.json();
        const list = Array.isArray(body) ? body : body?.data ?? [];
        if (!cancelled) setRows(list.map((row) => (mapRow ? mapRow(row) : row)));
      } catch {
        if (!cancelled) setRows(seedRows);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [endpoint, seedRows, mapRow]);

  return { rows, setRows, loading };
}
