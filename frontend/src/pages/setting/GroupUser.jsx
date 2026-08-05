import { useState } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const inputClass =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]";

const SEED = [
  { id: 1, level: "Administrator", deskripsi: "Akses penuh seluruh sistem", status: true },
  { id: 2, level: "Operasional", deskripsi: "Akses modul operasional", status: true },
  { id: 3, level: "Viewer", deskripsi: "Hanya melihat data", status: false },
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
        checked ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"
      }`}
    >
      <span className={`w-2 h-2 rounded-full ${checked ? "bg-white" : "bg-slate-400"}`} />
      {checked ? "Active" : "Inactive"}
    </button>
  );
}

export default function GroupUser() {
  const [items, setItems] = useState(SEED);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ level: "", deskripsi: "", status: true });
  const [error, setError] = useState(null);

  function openAdd() {
    setEditing(null);
    setForm({ level: "", deskripsi: "", status: true });
    setError(null);
    setShowModal(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({ level: item.level, deskripsi: item.deskripsi, status: !!item.status });
    setError(null);
    setShowModal(true);
  }

  function handleSave() {
    if (!form.level.trim()) {
      setError("Level User harus diisi");
      return;
    }
    if (editing) {
      setItems((prev) =>
        prev.map((i) => (i.id === editing.id ? { ...i, ...form } : i))
      );
    } else {
      setItems((prev) => [...prev, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  }

  function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Grup User</h2>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F5C4C] text-white text-sm font-medium rounded-lg hover:bg-[#0C4A3D] transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Tambah
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {items.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              Tidak ada data
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-medium text-slate-600 w-12">No</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Level User</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Deskripsi</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600 w-24">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr
                    key={item.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                    <td className="px-4 py-3 text-slate-800 font-medium">{item.level}</td>
                    <td className="px-4 py-3 text-slate-800">{item.deskripsi}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.status
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.status ? "Active" : "Inactive"}
                      </span>
                    </td>
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
              <h3 className="text-lg font-semibold text-slate-900">
                {editing ? "Edit" : "Tambah"} Grup User
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="px-6 pt-4 shrink-0">
                <div className="px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-sm text-rose-600">
                  {error}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Level User <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.level}
                  onChange={(e) => setForm((prev) => ({ ...prev, level: e.target.value }))}
                  placeholder="Contoh: Administrator"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Deskripsi
                </label>
                <input
                  type="text"
                  value={form.deskripsi}
                  onChange={(e) => setForm((prev) => ({ ...prev, deskripsi: e.target.value }))}
                  placeholder="Deskripsi level user"
                  className={inputClass}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Status</span>
                <Toggle
                  checked={form.status}
                  onChange={(v) => setForm((prev) => ({ ...prev, status: v }))}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 shrink-0">
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
