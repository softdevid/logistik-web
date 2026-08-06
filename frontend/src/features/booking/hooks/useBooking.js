import { useMemo, useState } from "react";
import { initialRows } from "../constants/initialRows";
import { emptyForm } from "../components/BookingForm";
import { compareValues } from "../utils/compare";
import { downloadWorkbook } from "../utils/excel";

export default function useBooking() {
  const [rows, setRows] = useState(initialRows);
  const [searchField, setSearchField] = useState("awbNo");
  const [searchText, setSearchText] = useState("");
  const [draftSearch, setDraftSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortKey, setSortKey] = useState("id");
  const [sortDir, setSortDir] = useState("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState([]);
  const [importOpen, setImportOpen] = useState(false);

  const filteredRows = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    let result = rows;

    if (q) {
      result = result.filter((row) => {
        const fieldsToSearch = [searchField];
        if (searchField === "awbNo")
          fieldsToSearch.push("doNo", "sender", "receiver", "destination");
        return fieldsToSearch.some((field) =>
          String(row[field] || "")
            .toLowerCase()
            .includes(q),
        );
      });
    }

    return [...result].sort((a, b) => {
      const columnType =
        sortKey === "date"
          ? "date"
          : sortKey === "koli" ||
              sortKey === "kilo" ||
              sortKey === "volume" ||
              sortKey === "biaya" ||
              sortKey === "id"
            ? "number"
            : "text";
      const comparison = compareValues(a[sortKey], b[sortKey], columnType);
      return sortDir === "asc" ? comparison : -comparison;
    });
  }, [rows, searchField, searchText, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const visibleRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  function startRefresh() {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }

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

  function openCreate() {
    setEditingRow(null);
    setForm({ ...emptyForm });
    setFormErrors([]);
    setFormOpen(true);
  }

  function openEdit(row) {
    setEditingRow(row);
    setForm({
      awbNo: row.awbNo,
      date: row.date,
      doNo: row.doNo,
      destination: row.destination,
      sender: row.sender,
      receiver: row.receiver,
      koli: String(row.koli),
      kilo: String(row.kilo),
      volume: String(row.volume),
      biaya: String(row.biaya),
      status: row.status,
    });
    setFormErrors([]);
    setFormOpen(true);
  }

  function validateForm(nextForm) {
    const errors = [];
    const requiredFields = [
      "awbNo",
      "date",
      "doNo",
      "destination",
      "sender",
      "receiver",
      "koli",
      "kilo",
      "volume",
      "biaya",
      "status",
    ];
    requiredFields.forEach((field) => {
      if (String(nextForm[field] || "").trim() === "") {
        errors.push(`${field} wajib diisi`);
      }
    });

    const numericFields = ["koli", "kilo", "volume", "biaya"];
    numericFields.forEach((field) => {
      if (nextForm[field] !== "" && Number.isNaN(Number(nextForm[field]))) {
        errors.push(`${field} harus berupa angka`);
      }
    });

    if (
      nextForm.date &&
      Number.isNaN(new Date(`${nextForm.date}T00:00:00`).getTime())
    ) {
      errors.push("Tanggal tidak valid");
    }

    return errors;
  }

  function handleSave() {
    const errors = validateForm(form);
    if (errors.length) {
      setFormErrors(errors);
      return;
    }

    const payload = {
      ...form,
      koli: Number(form.koli),
      kilo: Number(form.kilo),
      volume: Number(form.volume),
      biaya: Number(form.biaya),
    };

    if (editingRow) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === editingRow.id ? { ...row, ...payload } : row,
        ),
      );
    } else {
      const nextId = Math.max(...rows.map((row) => row.id), 0) + 1;
      setRows((prev) => [{ id: nextId, ...payload }, ...prev]);
    }

    setFormOpen(false);
  }

  function handleDelete(row) {
    if (!window.confirm(`Yakin ingin menghapus AWB ${row.awbNo}?`)) return;
    setRows((prev) => prev.filter((item) => item.id !== row.id));
  }

  function handleTemplateDownload() {
    downloadWorkbook(
      [
        {
          "AWB No.": "AWB-ONS-000001",
          Tanggal: "2026-08-05",
          "DO No.": "DO-000001",
          Tujuan: "Jakarta Barat",
          Pengirim: "PT Contoh Pengirim",
          Penerima: "PT Contoh Penerima",
          Koli: 10,
          Kilo: 1200,
          Volume: 7.5,
          Biaya: 2500000,
          Status: "Open",
        },
      ],
      "template-on-site-outbound.xlsx",
      "Outbound Template",
    );
  }

  return {
    table: {
      rows,
      filteredRows,
      visibleRows,
      totalPages,
      page,
      pageSize,
      sortKey,
      sortDir,
      loading,
      setPage,
      setPageSize,
      setSortKey,
      setSortDir,
      setRows,
      startRefresh,
      handleSort,
      handleDelete,
    },
    search: {
      searchField,
      searchText,
      draftSearch,
      setSearchField,
      setSearchText,
      setDraftSearch,
      handleSearch,
    },
    form: {
      formOpen,
      editingRow,
      form,
      formErrors,
      setFormOpen,
      setEditingRow,
      setForm,
      setFormErrors,
      openCreate,
      openEdit,
      handleSave,
    },
    importDialog: {
      importOpen,
      setImportOpen,
      handleTemplateDownload,
    },
  };
}
