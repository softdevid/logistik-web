import { useMemo, useState } from "react";
import { toNumber } from "../utils/formatters";

const DEFAULT_PAGE_SIZE = 10;

export default function useReportTable({
  rows = [],
  columns = [],
  searchFields = [],
  dateField,
  branchField,
  selectFilters = [],
} = {}) {
  const [draftSearch, setDraftSearch] = useState("");
  const [searchText, setSearchText] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [branch, setBranch] = useState("all");
  const [selectValues, setSelectValues] = useState(
    Object.fromEntries(selectFilters.map((filter) => [filter.key, "all"])),
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [sortKey, setSortKey] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  const sortableTypes = useMemo(() => {
    const map = {};
    columns.forEach((column) => {
      if (column.sortable) map[column.key] = column.type;
    });
    return map;
  }, [columns]);

  const filteredRows = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    let result = [...rows];

    if (query && searchFields.length) {
      result = result.filter((row) =>
        searchFields.some((field) =>
          String(row[field] ?? "")
            .toLowerCase()
            .includes(query),
        ),
      );
    }

    if (dateField && (dateFrom || dateTo)) {
      const from = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : -Infinity;
      const to = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : Infinity;
      result = result.filter((row) => {
        const time = new Date(`${String(row[dateField] ?? "")}T00:00:00`).getTime();
        return !Number.isNaN(time) && time >= from && time <= to;
      });
    }

    if (branchField && branch !== "all") {
      result = result.filter((row) => String(row[branchField] ?? "") === branch);
    }

    selectFilters.forEach(({ key }) => {
      const value = selectValues[key];
      if (value && value !== "all") {
        result = result.filter((row) => String(row[key] ?? "") === value);
      }
    });

    if (sortKey) {
      const type = sortableTypes[sortKey] ?? "text";
      result.sort((a, b) => {
        let comparison;
        if (type === "number" || type === "currency" || type === "percent") {
          comparison = toNumber(a[sortKey]) - toNumber(b[sortKey]);
        } else if (type === "date") {
          const left = new Date(`${String(a[sortKey] ?? "")}T00:00:00`).getTime();
          const right = new Date(`${String(b[sortKey] ?? "")}T00:00:00`).getTime();
          comparison = left - right;
        } else {
          comparison = String(a[sortKey] ?? "").localeCompare(
            String(b[sortKey] ?? ""),
            "id",
            { numeric: true, sensitivity: "base" },
          );
        }
        return sortDir === "asc" ? comparison : -comparison;
      });
    }

    return result;
  }, [
    rows,
    searchText,
    searchFields,
    dateFrom,
    dateTo,
    dateField,
    branch,
    branchField,
    selectFilters,
    selectValues,
    sortKey,
    sortDir,
    sortableTypes,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  const activePage = Math.min(page, totalPages);

  const visibleRows = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, activePage, pageSize]);

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

  function handleReset() {
    setDraftSearch("");
    setSearchText("");
    setDateFrom("");
    setDateTo("");
    setBranch("all");
    setSelectValues(
      Object.fromEntries(selectFilters.map((filter) => [filter.key, "all"])),
    );
    setPage(1);
  }

  function setSelectValue(key, value) {
    setSelectValues((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  return {
    draftSearch,
    searchText,
    dateFrom,
    dateTo,
    branch,
    selectValues,
    page: activePage,
    pageSize,
    sortKey,
    sortDir,
    filteredRows,
    visibleRows,
    totalPages,
    setDraftSearch,
    setDateFrom,
    setDateTo,
    setBranch,
    setSelectValue,
    setPage,
    setPageSize,
    handleSearch,
    handleSort,
    handleReset,
  };
}
