import { useEffect, useMemo, useState } from "react";
import {
  MANIFEST_DEFAULT_PAGE_SIZE,
  MANIFEST_SEARCH_FIELDS,
} from "../constants";
import { compareManifestValues } from "../utils";

function matchesSearch(row, query) {
  if (!query) return true;

  return MANIFEST_SEARCH_FIELDS.some((field) =>
    String(row[field] ?? "")
      .toLowerCase()
      .includes(query),
  );
}

function matchesPeriod(row, periodFrom, periodTo) {
  const rowDate = row.date ? new Date(`${row.date}T00:00:00`) : null;
  if (!rowDate || Number.isNaN(rowDate.getTime())) return false;

  if (periodFrom) {
    const fromDate = new Date(`${periodFrom}T00:00:00`);
    if (rowDate < fromDate) return false;
  }

  if (periodTo) {
    const toDate = new Date(`${periodTo}T23:59:59`);
    if (rowDate > toDate) return false;
  }

  return true;
}

export default function useManifestTable({ rows = [] } = {}) {
  const [draftSearch, setDraftSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [periodFrom, setPeriodFrom] = useState("");
  const [periodTo, setPeriodTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(MANIFEST_DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  const filteredRows = useMemo(() => {
    const query = searchText.trim().toLowerCase();

    return [...rows]
      .filter((row) => matchesSearch(row, query))
      .filter((row) => matchesPeriod(row, periodFrom, periodTo))
      .sort((a, b) => {
        const columnType =
          sortKey === "date"
            ? "date"
            : ["totAwb", "totKoli", "totKg", "totVolume", "totBiaya", "id"].includes(sortKey)
              ? "number"
              : "text";

        const comparison = compareManifestValues(a[sortKey], b[sortKey], columnType);
        return sortDir === "asc" ? comparison : -comparison;
      });
  }, [rows, periodFrom, periodTo, searchText, sortDir, sortKey]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  const visibleRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  function handleSearch() {
    setSearchText(draftSearch);
    setPage(1);
  }

  function handleSort(key) {
    setPage(1);
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDir("asc");
  }

  function resetFilters() {
    setDraftSearch("");
    setSearchText("");
    setPeriodFrom("");
    setPeriodTo("");
    setPage(1);
  }

  return {
    draftSearch,
    searchText,
    periodFrom,
    periodTo,
    page,
    pageSize,
    sortKey,
    sortDir,
    filteredRows,
    visibleRows,
    totalPages,
    setDraftSearch,
    setSearchText,
    setPeriodFrom,
    setPeriodTo,
    setPage,
    setPageSize,
    setSortKey,
    setSortDir,
    handleSearch,
    handleSort,
    resetFilters,
  };
}
