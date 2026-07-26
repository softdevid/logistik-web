import { useState, useEffect, useCallback } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const API = "http://localhost:8080/api";

const TABS = ["Data Vendor", "NPWP", "Accounting"];

const emptyVendor = {
  name: "",
  address1: "",
  address2: "",
  city: "",
  code_pos: "",
  no_hp: "",
  fax: "",
  email: "",
  nama_kontak: "",
  branch: "",
  status: "Active",
  npwp: { no_npwp: "", nama_npwp: "", address1: "", address2: "", city: "", code_pos: "" },
  accounting: {
    debit_account_id: 0,
    credit_hutang_account_id: 0,
    credit_pendapatan_account_id: 0,
    bagi_hasil_percent: 0,
    komisi_percent: 0,
  },
};

export default function Vendor() {
  const [vendors, setVendors] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [cabangs, setCabangs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyVendor);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [vRes, aRes, cRes] = await Promise.all([
        fetch(`${API}/vendors`),
        fetch(`${API}/perkiraan`),
        fetch(`${API}/cabangs`),
      ]);
      if (vRes.ok) setVendors(await vRes.json());
      if (aRes.ok) setAccounts(await aRes.json());
      if (cRes.ok) setCabangs(await cRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function openAdd() {
    setEditing(null);
    setForm({ ...emptyVendor, npwp: { ...emptyVendor.npwp }, accounting: { ...emptyVendor.accounting } });
    setShowModal(true);
  }

  function openEdit(v) {
    setEditing(v);
    setForm({
      name: v.name || "",
      address1: v.address1 || "",
      address2: v.address2 || "",
      city: v.city || "",
      code_pos: v.code_pos || "",
      no_hp: v.no_hp || "",
      fax: v.fax || "",
      email: v.email || "",
      nama_kontak: v.nama_kontak || "",
      branch: v.branch || "",
      status: v.status || "Active",
      npwp: {
        no_npwp: v.npwp?.no_npwp || "",
        nama_npwp: v.npwp?.nama_npwp || "",
        address1: v.npwp?.address1 || "",
        address2: v.npwp?.address2 || "",
        city: v.npwp?.city || "",
        code_pos: v.npwp?.code_pos || "",
      },
      accounting: {
        debit_account_id: v.accounting?.debit_account_id || 0,
        credit_hutang_account_id: v.accounting?.credit_hutang_account_id || 0,
        credit_pendapatan_account_id: v.accounting?.credit_pendapatan_account_id || 0,
        bagi_hasil_percent: v.accounting?.bagi_hasil_percent || 0,
        komisi_percent: v.accounting?.komisi_percent || 0,
      },
    });
    setShowModal(true);
  }

  async function handleSave() {
    const url = editing ? `${API}/vendors/${editing.id}` : `${API}/vendors`;
    const method = editing ? "PUT" : "POST";
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setShowModal(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Yakin ingin menghapus vendor ini?")) return;
    try {
      const res = await fetch(`${API}/vendors/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  }

  function setField(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function setNpwpField(key, val) {
    setForm((f) => ({ ...f, npwp: { ...f.npwp, [key]: val } }));
  }

  function setAccField(key, val) {
    setForm((f) => ({ ...f, accounting: { ...f.accounting, [key]: val } }));
  }

  const filtered = vendors.filter((v) => {
    const q = search.toLowerCase();
    return (
      v.name?.toLowerCase().includes(q) ||
      v.city?.toLowerCase().includes(q) ||
      v.nama_kontak?.toLowerCase().includes(q) ||
      v.no_hp?.includes(q) ||
      v.email?.toLowerCase().includes(q)
    );
  });

  function accountName(id) {
    const a = accounts.find((a) => a.id === id);
    return a ? `${a.kode_rekening} - ${a.nama_rekening}` : "-";
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Data Vendor</h2>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F5C4C] text-white text-sm font-medium rounded-lg hover:bg-[#0C4A3D] transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Tambah Vendor
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari vendor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]"
        />
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 mb-4">
        <div className="flex gap-0">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Memuat data...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">Tidak ada data vendor</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {activeTab === 0 && (
                    <>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">No</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Nama</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Alamat</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Kota</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Kode Pos</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">No. Telp</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Fax</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Nama Kontak</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Cabang</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                      <th className="text-center px-4 py-3 font-medium text-slate-600">Aksi</th>
                    </>
                  )}
                  {activeTab === 1 && (
                    <>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">No</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Nama Vendor</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">NPWP</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Nama NPWP</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Alamat</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Kota</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Kode Pos</th>
                      <th className="text-center px-4 py-3 font-medium text-slate-600">Aksi</th>
                    </>
                  )}
                  {activeTab === 2 && (
                    <>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">No</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Nama Vendor</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Debit Account</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Credit (Hutang)</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Credit (Pendapatan)</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Bagi Hasil (%)</th>
                      <th className="text-left px-4 py-3 font-medium text-slate-600">Komisi (%)</th>
                      <th className="text-center px-4 py-3 font-medium text-slate-600">Aksi</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.map((v, i) => (
                  <tr key={v.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    {activeTab === 0 && (
                      <>
                        <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                        <td className="px-4 py-3 text-slate-800 font-medium">{v.name}</td>
                        <td className="px-4 py-3 text-slate-600">{v.address1}{v.address2 ? `, ${v.address2}` : ""}</td>
                        <td className="px-4 py-3 text-slate-600">{v.city}</td>
                        <td className="px-4 py-3 text-slate-600">{v.code_pos || "-"}</td>
                        <td className="px-4 py-3 text-slate-600">{v.no_hp}</td>
                        <td className="px-4 py-3 text-slate-600">{v.fax || "-"}</td>
                        <td className="px-4 py-3 text-slate-600">{v.nama_kontak}</td>
                        <td className="px-4 py-3 text-slate-600">{v.email || "-"}</td>
                        <td className="px-4 py-3 text-slate-600">{v.branch || "-"}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            v.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}>
                            {v.status}
                          </span>
                        </td>
                      </>
                    )}
                    {activeTab === 1 && (
                      <>
                        <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                        <td className="px-4 py-3 text-slate-800 font-medium">{v.name}</td>
                        <td className="px-4 py-3 text-slate-600">{v.npwp?.no_npwp || "-"}</td>
                        <td className="px-4 py-3 text-slate-600">{v.npwp?.nama_npwp || "-"}</td>
                        <td className="px-4 py-3 text-slate-600">{v.npwp?.address1 || "-"}{v.npwp?.address2 ? `, ${v.npwp.address2}` : ""}</td>
                        <td className="px-4 py-3 text-slate-600">{v.npwp?.city || "-"}</td>
                        <td className="px-4 py-3 text-slate-600">{v.npwp?.code_pos || "-"}</td>
                      </>
                    )}
                    {activeTab === 2 && (
                      <>
                        <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                        <td className="px-4 py-3 text-slate-800 font-medium">{v.name}</td>
                        <td className="px-4 py-3 text-slate-600">{accountName(v.accounting?.debit_account_id)}</td>
                        <td className="px-4 py-3 text-slate-600">{accountName(v.accounting?.credit_hutang_account_id)}</td>
                        <td className="px-4 py-3 text-slate-600">{accountName(v.accounting?.credit_pendapatan_account_id)}</td>
                        <td className="px-4 py-3 text-slate-600">{v.accounting?.bagi_hasil_percent ?? 0}%</td>
                        <td className="px-4 py-3 text-slate-600">{v.accounting?.komisi_percent ?? 0}%</td>
                      </>
                    )}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEdit(v)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F5C4C] hover:bg-[#0F5C4C]/[0.06] transition-colors"
                          title="Edit"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editing ? "Edit Vendor" : "Tambah Vendor"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* Modal Tabs */}
              <div className="border-b border-slate-200 mb-4">
                <div className="flex gap-0">
                  {TABS.map((tab, i) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(i)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
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

              {activeTab === 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Nama" required value={form.name} onChange={(v) => setField("name", v)} />
                  <Field label="No. Telp" required value={form.no_hp} onChange={(v) => setField("no_hp", v)} />
                  <Field label="Alamat" required value={form.address1} onChange={(v) => setField("address1", v)} className="sm:col-span-2" />
                  <Field label="Alamat 2" value={form.address2} onChange={(v) => setField("address2", v)} className="sm:col-span-2" />
                  <Field label="Kota" required value={form.city} onChange={(v) => setField("city", v)} />
                  <Field label="Kode Pos" value={form.code_pos} onChange={(v) => setField("code_pos", v)} />
                  <Field label="Fax" value={form.fax} onChange={(v) => setField("fax", v)} />
                  <Field label="Email" value={form.email} onChange={(v) => setField("email", v)} />
                  <Field label="Nama Kontak" required value={form.nama_kontak} onChange={(v) => setField("nama_kontak", v)} />
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cabang</label>
                    <select
                      value={form.branch}
                      onChange={(e) => setField("branch", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]"
                    >
                      <option value="">Pilih Cabang</option>
                      {cabangs.map((c) => (
                        <option key={c.id} value={c.nama}>{c.kode} - {c.nama}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setField("status", e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="NPWP" value={form.npwp.no_npwp} onChange={(v) => setNpwpField("no_npwp", v)} className="sm:col-span-2" />
                  <Field label="Nama NPWP" value={form.npwp.nama_npwp} onChange={(v) => setNpwpField("nama_npwp", v)} className="sm:col-span-2" />
                  <Field label="Alamat" value={form.npwp.address1} onChange={(v) => setNpwpField("address1", v)} className="sm:col-span-2" />
                  <Field label="Alamat 2" value={form.npwp.address2} onChange={(v) => setNpwpField("address2", v)} className="sm:col-span-2" />
                  <Field label="Kota" value={form.npwp.city} onChange={(v) => setNpwpField("city", v)} />
                  <Field label="Kode Pos" value={form.npwp.code_pos} onChange={(v) => setNpwpField("code_pos", v)} />
                </div>
              )}

              {activeTab === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField
                    label="Debit Account"
                    value={form.accounting.debit_account_id}
                    onChange={(v) => setAccField("debit_account_id", Number(v))}
                    options={accounts}
                  />
                  <SelectField
                    label="Credit Account (Hutang)"
                    value={form.accounting.credit_hutang_account_id}
                    onChange={(v) => setAccField("credit_hutang_account_id", Number(v))}
                    options={accounts}
                  />
                  <SelectField
                    label="Credit Account (Pendapatan)"
                    value={form.accounting.credit_pendapatan_account_id}
                    onChange={(v) => setAccField("credit_pendapatan_account_id", Number(v))}
                    options={accounts}
                  />
                  <Field
                    label="Bagi Hasil (%)"
                    type="number"
                    value={form.accounting.bagi_hasil_percent}
                    onChange={(v) => setAccField("bagi_hasil_percent", Number(v))}
                  />
                  <Field
                    label="Komisi (%)"
                    type="number"
                    value={form.accounting.komisi_percent}
                    onChange={(v) => setAccField("komisi_percent", Number(v))}
                  />
                </div>
              )}
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

function Field({ label, required, value, onChange, type = "text", className = "" }) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]"
      />
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]"
      >
        <option value={0}>Pilih Akun</option>
        {options.map((a) => (
          <option key={a.id} value={a.id}>{a.kode_rekening} - {a.nama_rekening}</option>
        ))}
      </select>
    </div>
  );
}
