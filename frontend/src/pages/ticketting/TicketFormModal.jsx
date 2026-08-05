import { useState } from "react";
import {
  XMarkIcon,
  PaperClipIcon,
  PhotoIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

const inputClass =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]";

export default function TicketFormModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().slice(0, 10),
    priority: "low",
    subject: "",
    file: "",
    namaMenu: "",
    url: "",
    remarks: "",
  });
  const [pictures, setPictures] = useState([{ file: "", detail: "", url: "" }]);
  const [error, setError] = useState(null);

  function set(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    set("file", file ? file.name : "");
  }

  function handlePictureFileChange(i, e) {
    const file = e.target.files?.[0];
    setPictures((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, file: file ? file.name : "" } : p))
    );
  }

  function updatePicture(i, key, val) {
    setPictures((prev) =>
      prev.map((p, idx) => (idx === i ? { ...p, [key]: val } : p))
    );
  }

  function addPicture() {
    setPictures((prev) => [...prev, { file: "", detail: "", url: "" }]);
  }

  function removePicture(i) {
    setPictures((prev) => prev.filter((_, idx) => idx !== i));
  }

  function handleSave() {
    if (!form.tanggal) {
      setError("Tanggal harus diisi");
      return;
    }
    if (!form.subject.trim()) {
      setError("Subject harus diisi");
      return;
    }
    onSave({
      ...form,
      subject: form.subject.trim(),
      pictures: pictures.filter((p) => p.file || p.detail || p.url),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <h3 className="text-lg font-semibold text-slate-900">Tambah Ticket</h3>
          <button
            onClick={onClose}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Tanggal <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={form.tanggal}
                onChange={(e) => set("tanggal", e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Priority <span className="text-rose-500">*</span>
              </label>
              <select
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
                className={inputClass}
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Subject <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={form.subject}
              onChange={(e) => set("subject", e.target.value)}
              placeholder="Judul permasalahan / permintaan"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Upload File
            </label>
            <label
              className={`${inputClass} flex items-center gap-2 cursor-pointer text-slate-500`}
            >
              <input type="file" className="hidden" onChange={handleFileChange} />
              <PaperClipIcon className="w-4 h-4 shrink-0" />
              <span className="truncate">{form.file || "Pilih file..."}</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nama Menu
            </label>
            <input
              type="text"
              value={form.namaMenu}
              onChange={(e) => set("namaMenu", e.target.value)}
              placeholder="Nama menu terkait"
              className={inputClass}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-700">Gambar</label>
              <button
                type="button"
                onClick={addPicture}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F5C4C] border border-[#0F5C4C]/40 rounded-lg hover:bg-[#0F5C4C]/[0.06] transition-colors"
              >
                <PlusIcon className="w-3.5 h-3.5" /> Tambah Gambar
              </button>
            </div>
            <div className="space-y-3">
              {pictures.map((p, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-3 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <label className="flex-1 flex items-center gap-2 cursor-pointer text-slate-500 border border-dashed border-slate-300 rounded-lg px-3 py-2 text-sm">
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handlePictureFileChange(i, e)}
                      />
                      <PhotoIcon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{p.file || "Pilih gambar..."}</span>
                    </label>
                    {pictures.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePicture(i)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={p.detail}
                      onChange={(e) => updatePicture(i, "detail", e.target.value)}
                      placeholder="Detail gambar"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={p.url}
                      onChange={(e) => updatePicture(i, "url", e.target.value)}
                      placeholder="URL gambar"
                      className={inputClass}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              URL
            </label>
            <input
              type="text"
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              placeholder="URL halaman terkait"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Remarks
            </label>
            <textarea
              value={form.remarks}
              onChange={(e) => set("remarks", e.target.value)}
              rows={4}
              placeholder="Catatan tambahan..."
              className={`${inputClass} resize-y`}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 shrink-0">
          <button
            onClick={onClose}
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
  );
}
