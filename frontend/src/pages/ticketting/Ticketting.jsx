import { useState } from "react";
import TicketSupport from "./TicketSupport";
import TicketApproval from "./TicketApproval";

const SEED = [
  {
    id: 1,
    noTicket: "TCK-26080001",
    tanggal: "2026-08-05",
    priority: "high",
    subject: "Form tidak bisa simpan saat input data pelanggan",
    namaMenu: "Data Pelanggan",
    url: "https://app.example.com/pelanggan",
    file: "lampiran-error.pdf",
    remarks: "Muncul error 500 saat klik tombol simpan.",
    status: "pending",
    pictures: [
      {
        file: "error-1.png",
        detail: "Screenshot tampilan error",
        url: "https://img.example.com/error-1.png",
      },
    ],
  },
  {
    id: 2,
    noTicket: "TCK-26080002",
    tanggal: "2026-08-03",
    priority: "medium",
    subject: "Perubahan format laporan keuangan",
    namaMenu: "Laporan Keuangan",
    url: "https://app.example.com/laporan-keuangan",
    file: "",
    remarks: "Tambah kolom jumlah transaksi pada tabel ringkasan.",
    status: "selesai",
    pictures: [],
  },
  {
    id: 3,
    noTicket: "TCK-26080003",
    tanggal: "2026-08-01",
    priority: "low",
    subject: "Permintaan penambahan fitur export excel",
    namaMenu: "Laporan Cabang",
    url: "https://app.example.com/laporan-cabang",
    file: "",
    remarks: "Mohon sediakan tombol export ke format excel.",
    status: "revisi",
    pictures: [],
  },
];

export default function Ticketting() {
  const [activeTab, setActiveTab] = useState(0);
  const [tickets, setTickets] = useState(SEED);

  function handleAdd(form) {
    const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "");
    const seq = String(tickets.length + 1).padStart(4, "0");
    setTickets((prev) => [
      { ...form, id: Date.now(), noTicket: `TCK-${datePart}${seq}`, status: "pending" },
      ...prev,
    ]);
  }

  function handleStatus(id, status) {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <h2 className="text-xl font-bold text-slate-900 mb-6">Ticketing</h2>

      <div className="border-b border-slate-200 mb-6">
        <div className="flex gap-0 overflow-x-auto">
          {["Ticket Support", "Persetujuan Ticketing"].map((label, i) => (
            <button
              key={label}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === i
                  ? "border-[#0F5C4C] text-[#0F5C4C]"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 0 ? (
        <TicketSupport tickets={tickets} onAdd={handleAdd} onStatus={handleStatus} />
      ) : (
        <TicketApproval tickets={tickets} />
      )}
    </div>
  );
}
