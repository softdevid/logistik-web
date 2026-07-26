import { useState, useEffect, useCallback } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const API = "http://localhost:8080/api";

export default function RugiLabaPage() {
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/rugi-laba`);
      if (res.ok) setItems(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  function openAdd() {
    setEditing(null);
    setKode("");
    setNama("");
    setShowModal(true);
  }

  function openEdit(item) {
    setEditing(item);
    setKode(item.kode || "");
    setNama(item.nama);
    setShowModal(true);
  }

  async function handleSave() {
    const url = editing ? `${API}/rugi-laba/${editing.id}` : `${API}/rugi-laba`;
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kode, nama }),
    });
    if (res.ok) { setShowModal(false); fetchData(); }
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus?")) return;
    const res = await fetch(`${API}/rugi-laba/${id}`, { method: "DELETE" });
    if (res.ok) fetchData();
  }

  const filtered = items.filter((i) => {
    const q = search.toLowerCase();
    return i.kode?.toLowerCase().includes(q) || i.nama?.toLowerCase().includes(q);
  });

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Rugi Laba</h2>
        <button onClick={openAdd} className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F5C4C] text-white text-sm font-medium rounded-lg hover:bg-[#0C4A3D] transition-colors">
          <PlusIcon className="w-4 h-4" /> Tambah
        </button>
      </div>

      <input type="text" placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)}
        className="mb-4 w-full sm:w-80 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]" />

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
                  <th className="text-left px-4 py-3 font-medium text-slate-600">No</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Kode</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Nama</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, i) => (
                  <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50/50">
                    <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                    <td className="px-4 py-3 text-slate-800 font-mono">{item.kode || "-"}</td>
                    <td className="px-4 py-3 text-slate-800">{item.nama}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F5C4C] hover:bg-[#0F5C4C]/[0.06] transition-colors"><PencilSquareIcon className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(item.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"><TrashIcon className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">{editing ? "Edit" : "Tambah"} Rugi Laba</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"><XMarkIcon className="w-5 h-5" /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Kode</label>
                <input value={kode} onChange={(e) => setKode(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama <span className="text-rose-500">*</span></label>
                <input value={nama} onChange={(e) => setNama(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">Batal</button>
              <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-[#0F5C4C] rounded-lg hover:bg-[#0C4A3D]">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
