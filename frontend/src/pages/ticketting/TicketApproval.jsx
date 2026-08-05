import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default function TicketApproval({ tickets }) {
  const approved = tickets.filter((t) => t.status === "selesai");

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        {approved.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            Tidak ada data persetujuan
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 font-medium text-slate-600 w-12">
                  No
                </th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">
                  Judul
                </th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">
                  Nama Menu
                </th>
                <th className="text-left px-4 py-3 font-medium text-slate-600">
                  Link URL
                </th>
                <th className="text-center px-4 py-3 font-medium text-slate-600 w-36">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {approved.map((t, i) => (
                <tr
                  key={t.id}
                  className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-4 py-3 text-slate-500">{i + 1}</td>
                  <td className="px-4 py-3 text-slate-800">{t.subject}</td>
                  <td className="px-4 py-3 text-slate-800">{t.namaMenu || "-"}</td>
                  <td className="px-4 py-3">
                    {t.url ? (
                      <a
                        href={t.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#0F5C4C] hover:underline break-all"
                      >
                        {t.url}
                      </a>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center">
                      <a
                        href={t.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                          t.url
                            ? "text-[#0F5C4C] border border-[#0F5C4C]/40 hover:bg-[#0F5C4C]/[0.06]"
                            : "text-slate-300 border border-slate-200 pointer-events-none"
                        }`}
                      >
                        <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5" /> Buka
                        Link
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
