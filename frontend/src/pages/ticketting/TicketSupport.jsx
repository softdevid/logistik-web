import { useMemo, useState } from "react";
import {
  ArrowPathIcon,
  PlusIcon,
  EyeIcon,
  CheckBadgeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import TicketFormModal from "./TicketFormModal";
import TicketDetailModal from "./TicketDetailModal";
import TicketBadge from "./TicketBadge";
import { PRIORITY_META, STATUS_META } from "./ticketUtils";

const inputClass =
  "w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]";

export default function TicketSupport({ tickets, onAdd, onStatus }) {
  const [noTicket, setNoTicket] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [detail, setDetail] = useState(null);

  const filtered = useMemo(
    () =>
      tickets.filter((t) => {
        if (noTicket && !t.noTicket.toLowerCase().includes(noTicket.toLowerCase()))
          return false;
        if (dateFrom && t.tanggal < dateFrom) return false;
        if (dateTo && t.tanggal > dateTo) return false;
        if (statusFilter && t.status !== statusFilter) return false;
        return true;
      }),
    [tickets, noTicket, dateFrom, dateTo, statusFilter]
  );

  function handleRefresh() {
    setNoTicket("");
    setDateFrom("");
    setDateTo("");
    setStatusFilter("");
  }

  function handleApprove(t) {
    if (!window.confirm(`Approve dan selesaikan ticket "${t.noTicket}"?`)) return;
    onStatus(t.id, "selesai");
  }

  function handleRevise(t) {
    if (!window.confirm(`Kembalikan ticket "${t.noTicket}" untuk revisi?`)) return;
    onStatus(t.id, "revisi");
  }

  return (
    <div>
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            No. Ticket
          </label>
          <input
            type="text"
            value={noTicket}
            onChange={(e) => setNoTicket(e.target.value)}
            placeholder="Cari no. ticket..."
            className={`${inputClass} sm:w-48`}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Dari
          </label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Sampai
          </label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status Ticket
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={inputClass}
          >
            <option value="">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="revisi">Revisi</option>
            <option value="selesai">Selesai</option>
          </select>
        </div>
        <button
          onClick={handleRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#0F5C4C] border border-[#0F5C4C]/40 rounded-lg hover:bg-[#0F5C4C]/[0.06] transition-colors"
        >
          <ArrowPathIcon className="w-4 h-4" /> Refresh
        </button>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0F5C4C] text-white text-sm font-medium rounded-lg hover:bg-[#0C4A3D] transition-colors"
        >
          <PlusIcon className="w-4 h-4" /> Add
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
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
                  <th className="text-left px-4 py-3 font-medium text-slate-600">
                    No. Ticket
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">
                    Tanggal
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">
                    Priority
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">
                    Subject
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">
                    Nama Menu
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">
                    Status
                  </th>
                  <th className="text-center px-4 py-3 font-medium text-slate-600 w-36">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t, i) => (
                  <tr
                    key={t.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                    <td className="px-4 py-3 text-slate-800 font-medium">
                      {t.noTicket}
                    </td>
                    <td className="px-4 py-3 text-slate-800">{t.tanggal}</td>
                    <td className="px-4 py-3">
                      <TicketBadge meta={PRIORITY_META} value={t.priority} />
                    </td>
                    <td className="px-4 py-3 text-slate-800">{t.subject}</td>
                    <td className="px-4 py-3 text-slate-800">{t.namaMenu || "-"}</td>
                    <td className="px-4 py-3">
                      <TicketBadge meta={STATUS_META} value={t.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setDetail(t)}
                          title="Lihat"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F5C4C] hover:bg-[#0F5C4C]/[0.06] transition-colors"
                        >
                          <EyeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleApprove(t)}
                          disabled={t.status === "selesai"}
                          title="Approve Finish"
                          className={`p-1.5 rounded-lg transition-colors ${
                            t.status === "selesai"
                              ? "text-slate-200 cursor-not-allowed"
                              : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          <CheckBadgeIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRevise(t)}
                          disabled={t.status === "selesai"}
                          title="Revisi"
                          className={`p-1.5 rounded-lg transition-colors ${
                            t.status === "selesai"
                              ? "text-slate-200 cursor-not-allowed"
                              : "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
                          }`}
                        >
                          <PencilSquareIcon className="w-4 h-4" />
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

      {showForm && (
        <TicketFormModal
          onClose={() => setShowForm(false)}
          onSave={(form) => {
            onAdd(form);
            setShowForm(false);
          }}
        />
      )}
      {detail && (
        <TicketDetailModal ticket={detail} onClose={() => setDetail(null)} />
      )}
    </div>
  );
}
