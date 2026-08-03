import { useState, useEffect, useCallback } from "react";
import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { apiRequest } from "../../api";

const emptyForm = {
  kode_rekening: "",
  inisial_akun: "",
  nama_rekening: "",
  induk_id: null,
  ledger_id: 0,
  kategori_akun_id: 0,
  posisi: "Neraca",
  normal_balance: "Debet",
  tampil: "Show",
  jenis_kategori: "Child",
  rugi_laba_id: null,
  kategori_cashflow_id: null,
  cabang_id: null,
  status: true,
};

export default function Perkiraan() {
  const [accounts, setAccounts] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [kategoriAkuns, setKategoriAkuns] = useState([]);
  const [rugiLabaKategoris, setRugiLabaKategoris] = useState([]);
  const [kategoriCashflows, setKategoriCashflows] = useState([]);
  const [branches, setCabangs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [aRes, lRes, kRes, rRes, kcRes, cRes] = await Promise.all([
        apiRequest("/perkiraan"),
        apiRequest("/ledgers"),
        apiRequest("/account-categories"),
        apiRequest("/profit-loss"),
        apiRequest("/cashflows"),
        apiRequest("/branches"),
      ]);
      if (aRes.ok) setAccounts(await aRes.json());
      if (lRes.ok) setLedgers(await lRes.json());
      if (kRes.ok) setKategoriAkuns(await kRes.json());
      if (rRes.ok) setRugiLabaKategoris(await rRes.json());
      if (kcRes.ok) setKategoriCashflows(await kcRes.json());
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
    setForm({ ...emptyForm });
    setShowModal(true);
  }

  function openEdit(a) {
    setEditing(a);
    setForm({
      kode_rekening: a.kode_rekening || "",
      inisial_akun: a.inisial_akun || "",
      nama_rekening: a.nama_rekening || "",
      induk_id: a.induk_id || null,
      ledger_id: a.ledger_id || 0,
      kategori_akun_id: a.kategori_akun_id || 0,
      posisi: a.posisi || "Neraca",
      normal_balance: a.normal_balance || "Debet",
      tampil: a.tampil || "Show",
      jenis_kategori: a.jenis_kategori || "Child",
      rugi_laba_id: a.rugi_laba_id || null,
      kategori_cashflow_id: a.kategori_cashflow_id || null,
      cabang_id: a.cabang_id || null,
      status: a.status ?? true,
    });
    setShowModal(true);
  }

  async function handleSave() {
    const url = editing ? `/perkiraan/${editing.id}` : `/perkiraan`;
    const method = editing ? "PUT" : "POST";
    const body = {
      ...form,
      induk_id: form.induk_id || null,
      ledger_id: form.ledger_id || 1,
      kategori_akun_id: form.kategori_akun_id || 1,
      rugi_laba_id: form.rugi_laba_id || null,
      kategori_cashflow_id: form.kategori_cashflow_id || null,
      cabang_id: form.cabang_id || null,
    };
    try {
      const res = await apiRequest(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
    if (!window.confirm("Yakin ingin menghapus akun ini?")) return;
    try {
      const res = await apiRequest(`/perkiraan/${id}`, { method: "DELETE" });
      if (res.ok) fetchData();
    } catch (e) {
      console.error(e);
    }
  }

  function setField(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  const filtered = accounts.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.kode_rekening?.toLowerCase().includes(q) ||
      a.nama_rekening?.toLowerCase().includes(q)
    );
  });

  function ledgerName(id) {
    const l = ledgers.find((l) => l.id === id);
    return l ? `${l.kode} - ${l.nama}` : "-";
  }

  function kategoriName(id) {
    const k = kategoriAkuns.find((k) => k.id === id);
    return k ? k.nama : "-";
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-slate-900">Perkiraan</h2>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F5C4C] text-white text-sm font-medium rounded-lg hover:bg-[#0C4A3D] transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Tambah Akun
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari kode atau nama akun..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-slate-400 text-sm">Memuat data...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">Tidak ada data akun</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-medium text-slate-600">No</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Kode Rekening</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Nama Rekening</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Tampil</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Normal</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Posisi</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Status</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr key={a.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                    <td className="px-4 py-3 text-slate-800 font-mono font-medium">{a.kode_rekening}</td>
                    <td className="px-4 py-3 text-slate-800">{a.nama_rekening}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        a.tampil === "Show"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}>
                        {a.tampil}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600 capitalize">{a.normal_balance}</td>
                    <td className="px-4 py-3 text-slate-600">{a.posisi}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        a.status
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-600"
                      }`}>
                        {a.status ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openEdit(a)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F5C4C] hover:bg-[#0F5C4C]/[0.06] transition-colors"
                          title="Edit"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(a.id)}
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
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">
                {editing ? "Edit Akun" : "Tambah Akun"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Kode Rekening" required value={form.kode_rekening} onChange={(v) => setField("kode_rekening", v)} />
                <Field label="Inisial Akun" value={form.inisial_akun} onChange={(v) => setField("inisial_akun", v)} />
                <Field label="Nama Rekening" required value={form.nama_rekening} onChange={(v) => setField("nama_rekening", v)} className="sm:col-span-2" />

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Posisi</label>
                  <select value={form.posisi} onChange={(e) => setField("posisi", e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]">
                    <option value="Neraca">Neraca</option>
                    <option value="Rugi Laba">Rugi Laba</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Normal Balance</label>
                  <select value={form.normal_balance} onChange={(e) => setField("normal_balance", e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]">
                    <option value="Debet">Debet</option>
                    <option value="Kredit">Kredit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tampil</label>
                  <select value={form.tampil} onChange={(e) => setField("tampil", e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]">
                    <option value="Show">Show</option>
                    <option value="Hide">Hide</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kategori</label>
                  <select value={form.jenis_kategori} onChange={(e) => setField("jenis_kategori", e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]">
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Ledger</label>
                  <select value={form.ledger_id} onChange={(e) => setField("ledger_id", Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]">
                    <option value={0}>Pilih Ledger</option>
                    {ledgers.map((l) => (
                      <option key={l.id} value={l.id}>{l.kode} - {l.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori Akun</label>
                  <select value={form.kategori_akun_id} onChange={(e) => setField("kategori_akun_id", Number(e.target.value))} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]">
                    <option value={0}>Pilih Kategori</option>
                    {kategoriAkuns.map((k) => (
                      <option key={k.id} value={k.id}>{k.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Rugi Laba</label>
                  <select value={form.rugi_laba_id || ""} onChange={(e) => setField("rugi_laba_id", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]">
                    <option value="">Pilih Rugi Laba</option>
                    {rugiLabaKategoris.map((r) => (
                      <option key={r.id} value={r.id}>{r.kode} - {r.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori Cashflow</label>
                  <select value={form.kategori_cashflow_id || ""} onChange={(e) => setField("kategori_cashflow_id", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]">
                    <option value="">Pilih Cashflow</option>
                    {kategoriCashflows.map((k) => (
                      <option key={k.id} value={k.id}>{k.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Cabang</label>
                  <select value={form.cabang_id || ""} onChange={(e) => setField("cabang_id", e.target.value ? Number(e.target.value) : null)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]">
                    <option value="">Pilih Cabang (Nasional)</option>
                    {branches.map((c) => (
                      <option key={c.id} value={c.id}>{c.kode} - {c.nama}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <label className="text-sm font-medium text-slate-700">Status</label>
                  <button
                    type="button"
                    onClick={() => setField("status", !form.status)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      form.status ? "bg-[#0F5C4C]" : "bg-slate-300"
                    }`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      form.status ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                  <span className="text-sm text-slate-500">{form.status ? "Aktif" : "Nonaktif"}</span>
                </div>
              </div>
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
