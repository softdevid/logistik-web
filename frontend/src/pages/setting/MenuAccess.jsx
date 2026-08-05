import { useState } from "react";
import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const inputClass =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]";

const GROUPS = [
  { id: 1, name: "Administrator" },
  { id: 2, name: "Operasional" },
  { id: 3, name: "Viewer" },
];

const MENU_LIST = [
  "Dashboard",
  "Sistem Setting - Grup User",
  "Sistem Setting - Manajemen User",
  "Sistem Setting - Hak Akses Menu",
  "Kantor",
  "Master Data - Logistik",
  "Master Data - Vendor",
  "Master Data - Perkiraan",
  "Master Data - Shipment Status",
  "Akunting",
  "Modul - Pemasaran/Penjualan",
  "Modul - Transaksi",
  "Modul - Booking",
  "Modul - Operasional",
  "Laporan - Cabang",
  "Laporan - Kurir",
  "Laporan - Keuangan",
  "Laporan - Customer",
  "Ticketing",
];

function makeAccess(groupId) {
  const all = groupId === 1;
  return MENU_LIST.map((name, i) => ({
    id: i + 1,
    name,
    read: all ? true : i % 3 !== 0,
    input: all ? true : i % 4 === 0,
    edit: all ? true : i % 4 === 1,
    del: all ? true : i % 5 === 0,
  }));
}

function AccessCheckbox({ label, checked, onChange }) {
  return (
    <td className="px-4 py-3 text-center">
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 rounded border-slate-300 text-[#0F5C4C] focus:ring-[#0F5C4C]/30 cursor-pointer"
        />
        <span className="sr-only">{label}</span>
      </label>
    </td>
  );
}

export default function MenuAccess() {
  const [groupId, setGroupId] = useState("1");
  const [type, setType] = useState("all");
  const [access, setAccess] = useState(null);
  const [loadedGroup, setLoadedGroup] = useState("");

  function handleShowMenu() {
    setAccess(makeAccess(Number(groupId)));
    setLoadedGroup(GROUPS.find((g) => g.id === Number(groupId))?.name || "");
  }

  function handleRefresh() {
    setGroupId("1");
    setType("all");
    setAccess(null);
    setLoadedGroup("");
  }

  function toggle(id, key) {
    setAccess((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [key]: !m[key] } : m))
    );
  }

  const visible = access
    ? type === "selected"
      ? access.filter((m) => m.read || m.input || m.edit || m.del)
      : access
    : [];

  return (
    <div className="p-6 lg:p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Hak Akses Menu</h2>

      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Group User
          </label>
          <select
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            className={inputClass}
          >
            {GROUPS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={inputClass}
          >
            <option value="all">Semua Menu</option>
            <option value="selected">Terpilih</option>
          </select>
        </div>
        <button
          onClick={handleShowMenu}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F5C4C] text-white text-sm font-medium rounded-lg hover:bg-[#0C4A3D] transition-colors"
        >
          <MagnifyingGlassIcon className="w-4 h-4" /> Show Menu
        </button>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0F5C4C] border border-[#0F5C4C]/40 rounded-lg hover:bg-[#0F5C4C]/[0.06] transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4" /> Refresh
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {!access ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              Pilih group user dan type, lalu klik Show Menu
            </div>
          ) : visible.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">
              Tidak ada data
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left px-4 py-3 font-medium text-slate-600 w-12">No</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Menu</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Group User</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Read</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Input</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Edit</th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600">Delete</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((m, i) => (
                  <tr
                    key={m.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                    <td className="px-4 py-3 text-slate-800">{m.name}</td>
                    <td className="px-4 py-3 text-slate-800">{loadedGroup}</td>
                    <AccessCheckbox label="Read" checked={m.read} onChange={() => toggle(m.id, "read")} />
                    <AccessCheckbox label="Input" checked={m.input} onChange={() => toggle(m.id, "input")} />
                    <AccessCheckbox label="Edit" checked={m.edit} onChange={() => toggle(m.id, "edit")} />
                    <AccessCheckbox label="Delete" checked={m.del} onChange={() => toggle(m.id, "del")} />
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
