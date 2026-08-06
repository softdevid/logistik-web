import { useCallback, useEffect, useState } from "react";
import { MANIFEST_DEFAULT_FORM, MANIFEST_SEED_ROWS } from "../constants";
import { buildManifestPayload, getNextManifestId, normalizeManifestRow } from "../utils";
import { createManifest, listManifests } from "../services";
import useManifestForm from "./useManifestForm";
import useManifestTable from "./useManifestTable";

function cloneSeedRows() {
  return MANIFEST_SEED_ROWS.map((row) => ({ ...row }));
}

export default function useManifest() {
  const [rows, setRows] = useState(cloneSeedRows);
  const [loading, setLoading] = useState(false);

  const loadRows = useCallback(async () => {
    setLoading(true);
    try {
      const apiRows = await listManifests();
      setRows(apiRows.length > 0 ? apiRows : cloneSeedRows());
    } catch {
      setRows((prev) => (prev.length > 0 ? prev : cloneSeedRows()));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRows();
  }, [loadRows]);

  const handleCreate = useCallback(
    async (formValue) => {
      const localPayload = buildManifestPayload(formValue, {
        id: getNextManifestId(rows),
        ...MANIFEST_DEFAULT_FORM,
      });

      try {
        const created = await createManifest(localPayload);
        setRows((prev) => [created, ...prev]);
      } catch {
        setRows((prev) => [normalizeManifestRow(localPayload), ...prev]);
      }
    },
    [rows],
  );

  const form = useManifestForm({ onSubmit: handleCreate });
  const table = useManifestTable({ rows });

  return {
    form,
    table,
    loading,
    refresh: loadRows,
    setRows,
  };
}
