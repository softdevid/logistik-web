import { useState, useEffect, useCallback } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const API = "http://localhost:8080/api";
const TABS = ["Ledger", "Kategori Akun", "Rugi Laba", "Kategori Cashflow"];

export default function Akunting() {
  const [activeTab, setActiveTab] = useState(0);
  const [ledgers, setLedgers] = useState([]);
  const [kategoriAkuns, setKategoriAkuns] = useState([]);
  const [rugiLabas, setRugiLabas] = useState([]);
  const [cashflows, setCashflows] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ kode: "", nama: "" });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [lRes, kRes, rRes, cRes] = await Promise.all([
        fetch(`${API}/ledgers`),
        fetch(`${API}/kategori-akuns`),
        fetch(`${API}/rugi-laba`),
        fetch(`${API}/cashflows`),
      ]);
      if (lRes.ok) setLedgers(await lRes.json());
      if (kRes.ok) setKategoriAkuns(await kRes.json());
      if (rRes.ok) setRugiLabas(await rRes.json());
      if (cRes.ok) setCashflows(await cRes.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function currentItems() {
    switch (activeTab) {
      case 0: return ledgers;
      case 1: return kategoriAkuns;
      case 2: return rugiLabas;
      case 3: return cashflows;
      default: return [];
    }
  }

  function currentEndpoint() {
    switch (activeTab) {
      case 0: return "ledgers";
      case 1: return "kategori-akuns";
      case 2: return "rugi-laba";
      case 3: return "cashflows";
      default: return "";
    }
  }

  function hasKode() {
    return activeTab === 0 || activeTab === 2;
  }

  function openAdd() {
    setEditing(null);
    setForm({ kode: "", nama: "" });
    setShowModal(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({ kode: item.kode || "", nama: item.nama || "" });
    setShowModal(true);
  }

  async function handleSave() {
    const ep = currentEndpoint();
    const url = editing ? `${API}/${ep}/${editing.id}` : `${API}/${ep}`;
    const method = editing ? "PUT" : "POST";
    const body = hasKode() ? { kode: form.kode, nama: form.nama } : { nama: form.nama };
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) { setShowModal(false); fetchData(); }
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus?")) return;
    const res = await fetch(`${API}/${currentEndpoint()}/${id}`, { method: "DELETE" });
    if (res.ok) fetchData();
  }

  const filtered = currentItems().filter((i) => {
    const q = search.toLowerCase();
    return i.kode?.toLowerCase().includes(q) || i.nama?.toLowerCase().includes(q);
  });

  function handleTabChange(i) {
    setActiveTab(i);
    setSearch("");
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Akunting</h2>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F5C4C] text-white text-sm font-medium rounded-lg hover:bg-[#0C4A3D] transition-colors">
          <PlusIcon className="w-4 h-4" /> Tambah
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-4">
        <div className="flex gap-0">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => handleTabChange(i)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === i
                  ? "border-[#0F5C4C] text-[#0F5C4C]"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Cari..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full sm:w-80 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]"
      />

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Memuat data...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">Tidak ada data</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-medium text-slate-600 w-12">No</th>
                  {hasKode() && (
                    <th className="text-left px-4 py-3 font-medium text-slate-600">Kode</th>
                  )}
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Nama</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600 w-24">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                    {hasKode() && (
                      <td className="px-4 py-3 text-slate-800 font-mono">{item.kode}</td>
                    )}
                    <td className="px-4 py-3 text-slate-800">{item.nama}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F5C4C] hover:bg-[#0F5C4C]/[0.06] transition-colors" title="Edit">
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors" title="Hapus">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editing ? "Edit" : "Tambah"} {TABS[activeTab]}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {hasKode() && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kode <span className="text-rose-500">*</span></label>
                  <input
                    value={form.kode}
                    onChange={(e) => setForm((f) => ({ ...f, kode: e.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama <span className="text-rose-500">*</span></label>
                <input
                  value={form.nama}
                  onChange={(e) => setForm((f) => ({ ...f, nama: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                Batal
              </button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-[#0F5C4C] rounded-lg hover:bg-[#0C4A3D] transition-colors">
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
