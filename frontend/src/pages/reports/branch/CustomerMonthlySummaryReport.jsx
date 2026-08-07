import { useMemo, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { formatReportNumber } from "@/features/reports/utils/formatters";
import { downloadReport } from "@/features/reports/utils/excel";
import { seedCustomerMonthly } from "@/features/reports/data/seed";

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const COLUMNS = [
  { key: "totalAwb", label: "Total AWB" },
  { key: "kg", label: "Kg" },
  { key: "volume", label: "Volume" },
  { key: "totalTransaksi", label: "Total Transaksi" },
];

const SUM_COLUMNS = new Set(COLUMNS.map((column) => column.key));

function formatPeriodDay(year, month, day) {
  return `${String(day).padStart(2, "0")}-${month}-${year}`;
}

const filterClass =
  "rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-[#0F5C4C] focus:ring-2 focus:ring-[#0F5C4C]/20";

export default function CustomerMonthlySummaryReport() {
  const options = useMemo(() => {
    const periods = [...new Set(seedCustomerMonthly.map((row) => row.period))].sort();
    const branches = [...new Set(seedCustomerMonthly.map((row) => row.branch))].sort();
    const years = [...new Set(periods.map((period) => period.slice(0, 4)))].sort();
    return { periods, branches, years };
  }, []);

  const [bulan, setBulan] = useState(options.periods.at(-1));
  const [tahun, setTahun] = useState("all");
  const [cabang, setCabang] = useState(options.branches[0]);

  const rows = useMemo(
    () =>
      seedCustomerMonthly
        .filter(
          (row) =>
            (bulan === "all" || row.period === bulan) &&
            (tahun === "all" || row.period.startsWith(tahun)) &&
            (cabang === "all" || row.branch === cabang),
        )
        .sort((a, b) => a.customer.localeCompare(b.customer)),
    [bulan, tahun, cabang],
  );

  const totals = useMemo(
    () =>
      Object.fromEntries(
        [...SUM_COLUMNS].map((key) => [key, rows.reduce((sum, row) => sum + (row[key] || 0), 0)]),
      ),
    [rows],
  );

  const monthNumber = bulan !== "all" ? Number(bulan.split("-")[1]) : null;

  const periodText = useMemo(() => {
    if (bulan !== "all") {
      const [y, m] = bulan.split("-");
      const daysInMonth = new Date(Date.UTC(Number(y), Number(m), 0)).getUTCDate();
      return `${formatPeriodDay(y, m, 1)} s/d ${formatPeriodDay(y, m, daysInMonth)}`;
    }
    if (tahun !== "all") return `Tahun ${tahun}`;
    return "Semua Periode";
  }, [bulan, tahun]);

  function handleExport() {
    const exportRows = [
      ...rows.map((row, index) => ({
        no: index + 1,
        namaPelanggan: row.customer,
        totalAwb: formatReportNumber(row.totalAwb),
        kg: formatReportNumber(row.kg),
        volume: formatReportNumber(row.volume),
        totalTransaksi: formatReportNumber(row.totalTransaksi),
      })),
      {
        no: "",
        namaPelanggan: "TOTAL",
        totalAwb: formatReportNumber(totals.totalAwb),
        kg: formatReportNumber(totals.kg),
        volume: formatReportNumber(totals.volume),
        totalTransaksi: formatReportNumber(totals.totalTransaksi),
      },
    ];
    const exportColumns = [
      { key: "no", label: "NO." },
      { key: "namaPelanggan", label: "Nama Pelanggan" },
      ...COLUMNS,
    ];
    downloadReport(exportRows, exportColumns, "rekap-customer-bulanan.xlsx", "Rekap Customer BL");
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Laporan Cabang
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Rekap Customer Bulanan
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Rekapitulasi perbandingan customer BL per cabang per bulan.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4">
            <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-600">Bulan</span>
                <select
                  value={bulan}
                  onChange={(e) => setBulan(e.target.value)}
                  className={filterClass}
                >
                  <option value="all">Semua Bulan</option>
                  {options.periods.map((period) => {
                    const [y, m] = period.split("-");
                    return (
                      <option key={period} value={period}>
                        {MONTH_NAMES[Number(m) - 1]} {y}
                      </option>
                    );
                  })}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-600">Tahun</span>
                <select
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
                  className={filterClass}
                >
                  <option value="all">Semua Tahun</option>
                  {options.years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-slate-600">Cabang</span>
                <select
                  value={cabang}
                  onChange={(e) => setCabang(e.target.value)}
                  className={filterClass}
                >
                  <option value="all">Semua Cabang</option>
                  {options.branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2">
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
          <div className="flex flex-col items-center gap-1 border-b border-slate-200 px-6 py-5 text-center">
            <h3 className="text-base font-bold uppercase tracking-[0.18em] text-slate-900">
              Laporan Rekap Customer BL
            </h3>
            <p className="text-sm font-semibold text-slate-600">CABANG : {cabang}</p>
            <p className="text-sm text-slate-500">
              PERIODE LAPORAN : {monthNumber ?? "Semua"}
            </p>
            <p className="text-sm text-slate-500">{periodText}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="whitespace-nowrap border-b border-r border-slate-200 px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    No.
                  </th>
                  <th className="whitespace-nowrap border-b border-r border-slate-200 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Nama Pelanggan
                  </th>
                  {COLUMNS.map((column) => (
                    <th
                      key={column.key}
                      className="whitespace-nowrap border-b border-r border-slate-200 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500"
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {rows.map((row, index) => (
                  <tr key={row.id} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap border-b border-r border-slate-200 px-4 py-2.5 text-center text-slate-500">
                      {index + 1}
                    </td>
                    <td className="border-b border-r border-slate-200 px-4 py-2.5 text-slate-700">
                      {row.customer}
                    </td>
                    {COLUMNS.map((column) => (
                      <td
                        key={column.key}
                        className="whitespace-nowrap border-b border-r border-slate-200 px-4 py-2.5 text-right tabular-nums text-slate-700"
                      >
                        {formatReportNumber(row[column.key])}
                      </td>
                    ))}
                  </tr>
                ))}
                {rows.length > 0 && (
                  <tr className="bg-slate-50 font-semibold">
                    <td className="border-b border-r border-slate-200 px-4 py-3 text-center text-slate-500">
                      &nbsp;
                    </td>
                    <td className="border-b border-r border-slate-200 px-4 py-3 uppercase tracking-wide text-slate-900">
                      Total
                    </td>
                    {COLUMNS.map((column) => (
                      <td
                        key={column.key}
                        className="whitespace-nowrap border-b border-r border-slate-200 px-4 py-3 text-right tabular-nums text-slate-900"
                      >
                        {formatReportNumber(totals[column.key])}
                      </td>
                    ))}
                  </tr>
                )}
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={COLUMNS.length + 2}
                      className="px-4 py-10 text-center text-sm text-slate-400"
                    >
                      Tidak ada data.
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
