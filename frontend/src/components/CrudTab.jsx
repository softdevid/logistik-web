import { useState, useEffect, useCallback } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { apiRequest } from "../api";

const ERROR_MAP = {
  "name is required": "Nama harus diisi",
  "code is required": "Kode harus diisi",
  "divider is required": "Divider harus diisi",
  "vehicle type not found": "Jenis kendaraan tidak ditemukan",
  "province not found": "Provinsi tidak ditemukan",
  "regency not found": "Kabupaten tidak ditemukan",
  "district not found": "Kecamatan tidak ditemukan",
  "village not found": "Kelurahan tidak ditemukan",
  "postal code not found": "Kode pos tidak ditemukan",
  "marketing not found": "Pemasaran tidak ditemukan",
  "driver not found": "Driver tidak ditemukan",
  "courier not found": "Kurir tidak ditemukan",
  "mode not found": "Moda tidak ditemukan",
  "service category not found": "Kategori layanan tidak ditemukan",
  "delivery service not found": "Layanan pengantaran tidak ditemukan",
  "goods type not found": "Jenis barang tidak ditemukan",
  "cost type not found": "Jenis biaya tidak ditemukan",
  "term not found": "Termin tidak ditemukan",
  "vehicle not found": "Kendaraan tidak ditemukan",
  "trucking type not found": "Jenis trucking tidak ditemukan",
  "branch not found": "Cabang tidak ditemukan",
  "shipment status not found": "Shipment status tidak ditemukan",
};

function translateError(msg) {
  if (!msg) return "Terjadi kesalahan";
  return ERROR_MAP[msg] || msg;
}

export default function CrudTab({ config }) {
  const [activeTab, setActiveTab] = useState(0);
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [dropdowns, setDropdowns] = useState({});
  const [error, setError] = useState(null);

  const tab = config.tabs[activeTab];
  const fields = tab.fields;

  // #buildform
  function buildInitialForm() {
    const obj = {};
    fields.forEach((f) => {
      if (f.type === "checkbox") {
        obj[f.key] = f.default ?? false;
      } else {
        obj[f.key] = f.default || "";
      }
    });
    return obj;
  }

  // #fetchdata
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiRequest(`/${tab.endpoint}`);
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } else {
        setItems([]);
      }
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // #fetchdropdowns
  useEffect(() => {
    const fetches = {};
    fields.forEach((f) => {
      if (f.type === "select" && f.fetch) {
        fetches[f.key] = { options: [], loading: true };
      }
    });
    if (Object.keys(fetches).length === 0) return;

    setDropdowns((prev) => ({ ...prev, ...fetches }));

    Object.keys(fetches).forEach((key) => {
      const f = fields.find((f) => f.key === key);
      apiRequest(`/${f.fetch}`)
        .then((r) => r.json())
        .then((data) => {
          setDropdowns((prev) => ({
            ...prev,
            [key]: { options: data, loading: false },
          }));
        })
        .catch(() => {
          setDropdowns((prev) => ({
            ...prev,
            [key]: { options: [], loading: false },
          }));
        });
    });
  }, [activeTab]);

  // #modal
  function openAdd() {
    setEditing(null);
    setForm(buildInitialForm());
    setError(null);
    setShowModal(true);
  }

  function openEdit(item) {
    setEditing(item);
    const obj = {};
    fields.forEach((f) => {
      if (f.type === "checkbox") {
        obj[f.key] = !!item[f.key];
      } else {
        obj[f.key] = item[f.key] ?? "";
      }
    });
    setForm(obj);
    setError(null);
    setShowModal(true);
  }

  // #save
  async function handleSave() {
    setError(null);
    const payload = { ...fields.reduce((acc, f) => {
      const val = form[f.key];
      if (f.type === "select" && f.fetch) {
        acc[f.key] = (val === "" || val === undefined || val === null) ? null : Number(val);
      } else if (f.type === "checkbox") {
        acc[f.key] = !!val;
      } else {
        acc[f.key] = val;
      }
      return acc;
    }, {}) };

    const url = editing
      ? `/${tab.endpoint}/${editing.id}`
      : `/${tab.endpoint}`;
    const method = editing ? "PUT" : "POST";
    const res = await apiRequest(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(translateError(data.error));
      return;
    }
    setShowModal(false);
    fetchData();
  }

  // #delete
  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus?")) return;
    const res = await apiRequest(`/${tab.endpoint}/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      fetchData();
    } else {
      const data = await res.json();
      alert(data.error || "Gagal menghapus data");
    }
  }

  // #search
  const filtered = (items || []).filter((item) => {
    const q = search.toLowerCase();
    if (!q) return true;
    return fields
      .filter((f) => f.type === "text" && f.searchable !== false)
      .some((f) => String(item[f.key] || "").toLowerCase().includes(q));
  });

  // #tabchange
  function handleTabChange(i) {
    setActiveTab(i);
    setSearch("");
  }

  // #tablecolumns
  const tableFields = fields.filter((f) => f.table !== false);

  // #renderfield
  function renderFormField(f) {
    if (f.type === "select") {
      const isDynamic = !!f.fetch;
      const dd = dropdowns[f.key];
      const options = isDynamic
        ? dd?.options || []
        : f.options || ["Active", "Inactive"];

      return (
        <select
          value={form[f.key] ?? ""}
          onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]"
        >
          <option value="">-- Pilih --</option>
          {options.map((opt) => {
            const val = typeof opt === "object" ? opt.id : opt;
            const label = typeof opt === "object" ? opt[f.fetchLabel || "nama"] : opt;
            return (
              <option key={val} value={val}>
                {label}
              </option>
            );
          })}
        </select>
      );
    }

    if (f.type === "checkbox") {
      return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!form[f.key]}
            onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.checked }))}
            className="w-4 h-4 rounded border-slate-300 text-[#0F5C4C] focus:ring-[#0F5C4C]/30"
          />
          <span className="text-sm text-slate-600">{f.checkLabel || "Aktif"}</span>
        </label>
      );
    }

    if (f.type === "date") {
      return (
        <input
          type="date"
          value={form[f.key] ?? ""}
          onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]"
        />
      );
    }

    if (f.type === "number") {
      return (
        <input
          type="number"
          value={form[f.key] ?? ""}
          onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]"
        />
      );
    }

    return (
      <input
        value={form[f.key] ?? ""}
        onChange={(e) => setForm((prev) => ({ ...prev, [f.key]: e.target.value }))}
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]"
      />
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* #header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">{config.title}</h2>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F5C4C] text-white text-sm font-medium rounded-lg hover:bg-[#0C4A3D] transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Tambah
        </button>
      </div>

      {/* #tabs */}
      <div className="border-b border-slate-200 mb-4">
        <div className="flex gap-0 overflow-x-auto">
          {config.tabs.map((t, i) => (
            <button
              key={t.label}
              onClick={() => handleTabChange(i)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === i
                  ? "border-[#0F5C4C] text-[#0F5C4C]"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* #search */}
      <input
        type="text"
        placeholder="Cari..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full sm:w-80 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]"
      />

      {/* #table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              Memuat data...
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              Tidak ada data
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-medium text-slate-600 w-12">
                    No
                  </th>
                  {tableFields.map((f) => (
                    <th
                      key={f.key}
                      className="text-left px-4 py-3 font-medium text-slate-600"
                    >
                      {f.label}
                    </th>
                  ))}
                  <th className="text-center px-4 py-3 font-medium text-slate-600 w-24">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                    {tableFields.map((f) => (
                      <td key={f.key} className="px-4 py-3 text-slate-800">
                        {f.badge ? (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              item[f.key] === "Active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {item[f.key]}
                          </span>
                        ) : f.type === "checkbox" ? (
                          item[f.key] ? (
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-emerald-100 text-emerald-600">&#10003;</span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )
                        ) : f.type === "select" && f.fetch ? (
                          // #dynamiclabel — for dropdown fields, show the label or "-" if null
                          item[f.key] == null ? (
                            <span className="text-slate-400">-</span>
                          ) : (() => {
                            const dd = dropdowns[f.key];
                            const match = dd?.options?.find(
                              (o) => String(o.id) === String(item[f.key])
                            );
                            return match ? match[f.fetchLabel || "nama"] : item[f.key];
                          })()
                        ) : (
                          item[f.key]
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEdit(item)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F5C4C] hover:bg-[#0F5C4C]/[0.06] transition-colors"
                          title="Edit"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Hapus"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* #modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editing ? "Edit" : "Tambah"} {tab.label}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            {error && (
              <div className="px-6 pt-4">
                <div className="px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-600">
                  {error}
                </div>
              </div>
            )}
            <div className="px-6 py-4 space-y-4">
              {fields.map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {f.label}
                    {f.required && <span className="text-rose-500"> *</span>}
                  </label>
                  {renderFormField(f)}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-[#0F5C4C] rounded-lg hover:bg-[#0C4A3D] transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
