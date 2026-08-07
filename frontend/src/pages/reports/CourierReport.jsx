import { useMemo, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Badge from "@/features/reports/components/Badge";
import { SHIPMENT_STATUS_META } from "@/features/reports";
import { formatReportDate, formatReportNumber } from "@/features/reports/utils/formatters";
import { downloadReport } from "@/features/reports/utils/excel";
import { seedCourierHarian, seedCourierReport } from "@/features/reports/data/seed";
import { BRANCHES } from "@/features/reports/constants/branches";

const STATUS_OPTIONS = Object.keys(SHIPMENT_STATUS_META).map((status) => ({
  value: status,
  label: status,
}));

const SLA_META = {
  OK: { label: "OK", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  Over: { label: "Over", className: "bg-rose-50 text-rose-700 ring-rose-200" },
};

const COLUMNS = [
  { key: "drsNo", label: "DRS No." },
  { key: "awbNo", label: "AWB No" },
  { key: "kurir", label: "Kurir" },
  { key: "date", label: "Tanggal", type: "date" },
  { key: "asal", label: "Asal" },
  { key: "tujuan", label: "Tujuan" },
  { key: "pengirim", label: "Pengirim" },
  { key: "layanan", label: "Layanan" },
  { key: "status", label: "Status" },
  { key: "penerima", label: "Penerima" },
  { key: "diterimaOleh", label: "Diterima Oleh" },
  { key: "tglDiterima", label: "Tgl. Diterima", type: "date" },
  { key: "accIn", label: "Acc. in" },
  { key: "lTime", label: "L.Time" },
  { key: "sla", label: "SLA" },
];

const TABS = [
  { id: "pengantaran", label: "Laporan Detail Kurir" },
  { id: "harian", label: "Harian Kurir" },
];

function cell(value) {
  if (value === null || value === undefined || value === "") return "-";
  return value;
}

const filterClass =
  "rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-[#0F5C4C] focus:ring-2 focus:ring-[#0F5C4C]/20";

function SummaryCard({ label, value, accentClass, iconClass }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
        <span className="text-base font-bold">✓</span>
      </div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className={`text-xl font-bold tabular-nums ${accentClass}`}>{value}</p>
      </div>
    </div>
  );
}

function dateFilterRows(rows, dateFrom, dateTo) {
  const from = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : -Infinity;
  const to = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : Infinity;
  return rows.filter((row) => {
    const time = new Date(`${row.date}T00:00:00`).getTime();
    return !Number.isNaN(time) && time >= from && time <= to;
  });
}

function PengantaranTab() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [branch, setBranch] = useState("all");
  const [kurir, setKurir] = useState("all");
  const [status, setStatus] = useState("all");

  const kurirOptions = useMemo(
    () => [...new Set(seedCourierReport.map((row) => row.kurir))].sort(),
    [],
  );

  const rows = useMemo(
    () =>
      dateFilterRows(seedCourierReport, dateFrom, dateTo)
        .filter((row) => branch === "all" || row.branch === branch)
        .filter((row) => kurir === "all" || row.kurir === kurir)
        .filter((row) => status === "all" || row.status === status)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [dateFrom, dateTo, branch, kurir, status],
  );

  const summary = useMemo(
    () => ({
      sukses: rows.filter((row) => row.status === "Delivered").length,
      pending: rows.filter(
        (row) => row.status === "Open" || row.status === "In Transit",
      ).length,
      failed: rows.filter((row) => row.status === "Cancelled").length,
    }),
    [rows],
  );

  function handleReset() {
    setDateFrom("");
    setDateTo("");
    setBranch("all");
    setKurir("all");
    setStatus("all");
  }

  function handleExport() {
    const exportRows = rows.map((row) => ({
      drsNo: cell(row.drsNo),
      awbNo: cell(row.awbNo),
      kurir: cell(row.kurir),
      tanggal: formatReportDate(row.date),
      asal: cell(row.asal),
      tujuan: cell(row.tujuan),
      pengirim: cell(row.pengirim),
      layanan: cell(row.layanan),
      status: SHIPMENT_STATUS_META[row.status]?.label ?? cell(row.status),
      penerima: cell(row.penerima),
      diterimaOleh: cell(row.diterimaOleh),
      tglDiterima: row.tglDiterima ? formatReportDate(row.tglDiterima) : "-",
      accIn: cell(row.accIn),
      lTime: cell(row.lTime),
      sla: cell(row.sla),
    }));
    const exportColumns = [
      { key: "drsNo", label: "DRS No." },
      { key: "awbNo", label: "AWB No" },
      { key: "kurir", label: "Kurir" },
      { key: "tanggal", label: "Tanggal" },
      { key: "asal", label: "Asal" },
      { key: "tujuan", label: "Tujuan" },
      { key: "pengirim", label: "Pengirim" },
      { key: "layanan", label: "Layanan" },
      { key: "status", label: "Status" },
      { key: "penerima", label: "Penerima" },
      { key: "diterimaOleh", label: "Diterima Oleh" },
      { key: "tglDiterima", label: "Tgl. Diterima" },
      { key: "accIn", label: "Acc. in" },
      { key: "lTime", label: "L.Time" },
      { key: "sla", label: "SLA" },
    ];
    downloadReport(exportRows, exportColumns, "laporan-kurir.xlsx", "Laporan Kurir");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Tot. Sukses"
          value={summary.sukses}
          accentClass="text-emerald-600"
          iconClass="bg-emerald-50 text-emerald-600"
        />
        <SummaryCard
          label="Tot. Pending"
          value={summary.pending}
          accentClass="text-amber-600"
          iconClass="bg-amber-50 text-amber-600"
        />
        <SummaryCard
          label="Tot. Failed"
          value={summary.failed}
          accentClass="text-rose-600"
          iconClass="bg-rose-50 text-rose-600"
        />
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-600">Periode Dari</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={filterClass}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-600">Periode Sampai</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={filterClass}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-600">Branch</span>
              <select
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className={filterClass}
              >
                <option value="all">Semua Branch</option>
                {BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-600">Kurir</span>
              <select
                value={kurir}
                onChange={(e) => setKurir(e.target.value)}
                className={filterClass}
              >
                <option value="all">Semua Kurir</option>
                {kurirOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-600">Status</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={filterClass}
              >
                <option value="all">Semua Status</option>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5C4C] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0C4A3D]"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h3 className="text-lg font-semibold text-slate-900">Daftar Detail Kurir</h3>
          <p className="text-sm text-slate-500">{rows.length} data</p>
        </div>

        <div className="overflow-x-auto">
          <div className="max-h-[60vh] overflow-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-slate-200 bg-slate-50/95 backdrop-blur-sm">
                  {COLUMNS.map((column) => (
                    <th
                      key={column.key}
                      className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {rows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-slate-50">
                    {COLUMNS.map((column) => {
                      const value = row[column.key];
                      let content = cell(value);
                      if (column.type === "date" && value) {
                        content = formatReportDate(value);
                      } else if (column.key === "status") {
                        content = <Badge value={value} meta={SHIPMENT_STATUS_META} />;
                      } else if (column.key === "sla" && value && value !== "-") {
                        content = <Badge value={value} meta={SLA_META} />;
                      }
                      return (
                        <td
                          key={column.key}
                          className={`whitespace-nowrap px-4 py-2.5 ${
                            content === "-" ? "text-slate-400" : "text-slate-700"
                          }`}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={COLUMNS.length}
                      className="px-4 py-10 text-center text-sm text-slate-400"
                    >
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function HarianKurirTab() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const rows = useMemo(() => {
    const filtered = dateFilterRows(seedCourierHarian, dateFrom, dateTo);
    const byKurir = new Map();
    filtered.forEach((row) => {
      const current = byKurir.get(row.kurir) || { kurir: row.kurir, terambil: 0, missPickup: 0 };
      current.terambil += row.terambil;
      current.missPickup += row.missPickup;
      byKurir.set(row.kurir, current);
    });
    return [...byKurir.values()].sort((a, b) => a.kurir.localeCompare(b.kurir));
  }, [dateFrom, dateTo]);

  const totals = useMemo(
    () => rows.reduce(
      (acc, row) => ({ terambil: acc.terambil + row.terambil, missPickup: acc.missPickup + row.missPickup }),
      { terambil: 0, missPickup: 0 },
    ),
    [rows],
  );

  function handleExport() {
    const exportRows = [
      ...rows.map((row) => ({
        namaKurir: row.kurir,
        terambil: formatReportNumber(row.terambil),
        missPickup: formatReportNumber(row.missPickup),
      })),
      {
        namaKurir: "TOTAL",
        terambil: formatReportNumber(totals.terambil),
        missPickup: formatReportNumber(totals.missPickup),
      },
    ];
    const exportColumns = [
      { key: "namaKurir", label: "Nama Kurir" },
      { key: "terambil", label: "Jumlah Terambil" },
      { key: "missPickup", label: "Jumlah Miss Pickup" },
    ];
    downloadReport(exportRows, exportColumns, "laporan-kurir-harian.xlsx", "Harian Kurir");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-600">Tanggal Dari</span>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className={filterClass}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-600">Tanggal Sampai</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className={filterClass}
              />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDateFrom("");
                setDateTo("");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5C4C] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0C4A3D]"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h3 className="text-lg font-semibold text-slate-900">Rekap Harian Kurir</h3>
          <p className="text-sm text-slate-500">{rows.length} kurir</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/95">
                <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Nama Kurir
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Jumlah Terambil
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Jumlah Miss Pickup
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {rows.map((row) => (
                <tr key={row.kurir} className="transition-colors hover:bg-slate-50">
                  <td className="whitespace-nowrap px-4 py-2.5 text-slate-700">{row.kurir}</td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-slate-700">
                    {formatReportNumber(row.terambil)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-slate-700">
                    {formatReportNumber(row.missPickup)}
                  </td>
                </tr>
              ))}
              {rows.length > 0 && (
                <tr className="bg-slate-50 font-semibold">
                  <td className="px-4 py-3 uppercase tracking-wide text-slate-900">Total</td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-900">
                    {formatReportNumber(totals.terambil)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-900">
                    {formatReportNumber(totals.missPickup)}
                  </td>
                </tr>
              )}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-10 text-center text-sm text-slate-400">
                    No data available in table
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function CourierReport() {
  const [activeTab, setActiveTab] = useState("pengantaran");

  return (
    <div className="min-h-full bg-slate-50 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Laporan
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Laporan Kurir
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Rekap pengantaran dan aktivitas harian kurir.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#0F5C4C] text-white shadow-sm"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "pengantaran" && <PengantaranTab />}
        {activeTab === "harian" && <HarianKurirTab />}
      </div>
    </div>
  );
}
