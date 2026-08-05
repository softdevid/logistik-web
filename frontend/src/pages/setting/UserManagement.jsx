import { useState } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

const inputClass =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]";

const GROUP_USERS = ["Administrator", "Operasional", "Viewer"];
const CUSTOMERS = ["PT Maju Jaya", "CV Karya Bangsa", "UD Berkah Sentosa"];
const VENDORS = ["PT Logistik Nusantara", "CV Angkutan Sejahtera"];
const MARKETINGS = ["Marketing - Jakarta", "Marketing - Surabaya"];
const LEVELS = ["Admin", "Operasional", "Viewer", "Kurir"];
const COURIERS = ["Kurir - Jakarta 1", "Kurir - Jakarta 2", "Kurir - Bandung 1"];

const SEED = [
  {
    id: 1,
    codeInitial: "ADM",
    firstName: "Administrator",
    lastName: "Sistem",
    username: "admin",
    email: "admin@mail.com",
    level: "Admin",
    groupUser: "Administrator",
    flagSession: true,
    active: true,
    photo: "",
  },
  {
    id: 2,
    codeInitial: "OPS",
    firstName: "Budi",
    lastName: "Santoso",
    username: "budi",
    email: "budi@mail.com",
    level: "Operasional",
    groupUser: "Operasional",
    flagSession: false,
    active: true,
    photo: "",
  },
  {
    id: 3,
    codeInitial: "VWR",
    firstName: "Siti",
    lastName: "Aminah",
    username: "siti",
    email: "siti@mail.com",
    level: "Viewer",
    groupUser: "Viewer",
    flagSession: false,
    active: false,
    photo: "",
  },
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

function emptyForm() {
  return {
    codeInitial: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
    photo: "",
    groupUser: "",
    customer: "",
    vendor: "",
    marketing: "",
    level: "",
    courier: "",
    active: true,
  };
}

function SelectField({ label, value, options, onChange, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        <option value="">-- Pilih --</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function UserManagement() {
  const [items, setItems] = useState(SEED);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [error, setError] = useState(null);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm());
    setError(null);
    setShowModal(true);
  }

  function openEdit(item) {
    setEditing(item);
    setForm({
      codeInitial: item.codeInitial,
      firstName: item.firstName,
      lastName: item.lastName,
      username: item.username,
      password: "",
      confirmPassword: "",
      email: item.email,
      photo: item.photo || "",
      groupUser: item.groupUser || "",
      customer: item.customer || "",
      vendor: item.vendor || "",
      marketing: item.marketing || "",
      level: item.level || "",
      courier: item.courier || "",
      active: !!item.active,
    });
    setError(null);
    setShowModal(true);
  }

  function set(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  function handleSave() {
    if (!form.codeInitial.trim()) return setError("Code Initial harus diisi");
    if (!form.username.trim()) return setError("Username harus diisi");
    if (!form.password) return setError("Password harus diisi");
    if (form.password !== form.confirmPassword)
      return setError("Konfirmasi password tidak sama");

    const password = form.password;
    const rest = { ...form };
    delete rest.password;
    delete rest.confirmPassword;
    if (editing) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editing.id ? { ...i, ...rest, password } : i
        )
      );
    } else {
      setItems((prev) => [...prev, { id: Date.now(), ...rest, password }]);
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
        <h2 className="text-xl font-bold text-slate-900">Manajemen User</h2>
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
                  <th className="text-left px-4 py-3 font-medium text-slate-600">ID</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Code Initial</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Username</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Level</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Flag Session</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Aktif</th>
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
                    <td className="px-4 py-3 text-slate-800">{item.id}</td>
                    <td className="px-4 py-3 text-slate-800">{item.codeInitial}</td>
                    <td className="px-4 py-3 text-slate-800">{item.username}</td>
                    <td className="px-4 py-3 text-slate-800">{item.email}</td>
                    <td className="px-4 py-3 text-slate-800">{item.level}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.flagSession
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.flagSession ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                        />
                        {item.flagSession ? "Online" : "Offline"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          item.active
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {item.active ? "Aktif" : "Nonaktif"}
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
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
              <h3 className="text-lg font-semibold text-slate-900">
                {editing ? "Edit" : "Tambah"} User
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Code Initial <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.codeInitial}
                    onChange={(e) => set("codeInitial", e.target.value)}
                    placeholder="Contoh: ADM"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Foto
                  </label>
                  <label
                    className={`${inputClass} flex items-center gap-2 cursor-pointer text-slate-500`}
                  >
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) =>
                        set("photo", e.target.files?.[0]?.name || "")
                      }
                    />
                    <PhotoIcon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{form.photo || "Pilih foto..."}</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={form.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={form.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Username <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => set("username", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => set("email", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={(e) => set("confirmPassword", e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Group User"
                  value={form.groupUser}
                  options={GROUP_USERS}
                  onChange={(v) => set("groupUser", v)}
                />
                <SelectField
                  label="Customer"
                  value={form.customer}
                  options={CUSTOMERS}
                  onChange={(v) => set("customer", v)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Vendor"
                  value={form.vendor}
                  options={VENDORS}
                  onChange={(v) => set("vendor", v)}
                />
                <SelectField
                  label="Marketing"
                  value={form.marketing}
                  options={MARKETINGS}
                  onChange={(v) => set("marketing", v)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectField
                  label="Level"
                  value={form.level}
                  options={LEVELS}
                  onChange={(v) => set("level", v)}
                />
                <SelectField
                  label="Kurir"
                  value={form.courier}
                  options={COURIERS}
                  onChange={(v) => set("courier", v)}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">Active</span>
                <Toggle
                  checked={form.active}
                  onChange={(v) => set("active", v)}
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
