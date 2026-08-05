import { XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";
import TicketBadge from "./TicketBadge";
import { PRIORITY_META, STATUS_META } from "./ticketUtils";

function Row({ label, children }) {
  return (
    <div>
      <span className="text-xs text-slate-400">{label}</span>
      <div className="text-sm text-slate-800 break-all">{children}</div>
    </div>
  );
}

export default function TicketDetailModal({ ticket, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Detail Ticket</h3>
            <p className="text-xs text-slate-500">{ticket.noTicket}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Row label="Tanggal">{ticket.tanggal}</Row>
            <Row label="Priority">
              <TicketBadge meta={PRIORITY_META} value={ticket.priority} />
            </Row>
          </div>
          <Row label="Status">
            <TicketBadge meta={STATUS_META} value={ticket.status} />
          </Row>
          <Row label="Subject">{ticket.subject}</Row>
          <Row label="Nama Menu">{ticket.namaMenu || "-"}</Row>
          <Row label="URL">
            {ticket.url ? (
              <a
                href={ticket.url}
                target="_blank"
                rel="noreferrer"
                className="text-[#0F5C4C] hover:underline"
              >
                {ticket.url}
              </a>
            ) : (
              "-"
            )}
          </Row>
          <Row label="File">{ticket.file || "-"}</Row>
          <Row label="Remarks">{ticket.remarks || "-"}</Row>

          {ticket.pictures?.length > 0 && (
            <div>
              <span className="text-xs text-slate-400">Gambar</span>
              <div className="mt-2 space-y-2">
                {ticket.pictures.map((p, i) => (
                  <div key={i} className="border border-slate-200 rounded-lg p-3 space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-800">
                      <PhotoIcon className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{p.file || "gambar"}</span>
                    </div>
                    {p.detail && (
                      <div className="text-xs text-slate-500">Detail: {p.detail}</div>
                    )}
                    {p.url && (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#0F5C4C] hover:underline break-all"
                      >
                        {p.url}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end px-6 py-4 border-t border-slate-200 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
