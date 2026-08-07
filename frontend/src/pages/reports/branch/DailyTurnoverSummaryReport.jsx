import { useMemo, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { formatReportNumber } from "@/features/reports/utils/formatters";
import { downloadReport } from "@/features/reports/utils/excel";
import { seedOmsetHarian } from "@/features/reports/data/seed";

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
  { key: "tunai", label: "TOTAL TUNAI" },
  { key: "bb", label: "TOTAL BB" },
  { key: "bl", label: "TOTAL BL" },
  { key: "transfer", label: "TOTAL TRANSFER" },
  { key: "totalOmset", label: "TOTAL OMSET" },
  { key: "darat", label: "DARAT" },
  { key: "laut", label: "LAUT" },
  { key: "udara", label: "UDARA" },
];

const NUMERIC_COLUMNS = new Set(COLUMNS.map((column) => column.key));

function formatPeriodDay(year, month, day) {
  return `${String(day).padStart(2, "0")}-${month}-${year}`;
}

function formatCell(value) {
  if (value === null || value === undefined) return "-";
  return formatReportNumber(value);
}

const filterClass =
  "rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-[#0F5C4C] focus:ring-2 focus:ring-[#0F5C4C]/20";

export default function DailyTurnoverSummaryReport() {
  const options = useMemo(() => {
    const periods = [...new Set(seedOmsetHarian.map((row) => row.tanggal.slice(0, 7)))].sort();
    const branches = [...new Set(seedOmsetHarian.map((row) => row.branch))].sort();
    const years = [...new Set(periods.map((period) => period.slice(0, 4)))].sort();
    return { periods, branches, years };
  }, []);

  const [bulan, setBulan] = useState(options.periods.at(-1));
  const [tahun, setTahun] = useState("all");
  const [cabang, setCabang] = useState(options.branches[0]);

  const rows = useMemo(
    () =>
      seedOmsetHarian
        .filter(
          (row) =>
            (bulan === "all" || row.tanggal.startsWith(bulan)) &&
            (tahun === "all" || row.tanggal.startsWith(tahun)) &&
            (cabang === "all" || row.branch === cabang),
        )
        .sort((a, b) => a.tanggal.localeCompare(b.tanggal)),
    [bulan, tahun, cabang],
  );

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
    const exportRows = rows.map((row, index) => ({
      no: index + 1,
      tanggal: row.tanggal,
      tunai: formatCell(row.tunai),
      bb: formatCell(row.bb),
      bl: formatCell(row.bl),
      transfer: formatCell(row.transfer),
      totalOmset: formatCell(row.totalOmset),
      darat: formatCell(row.darat),
      laut: formatCell(row.laut),
      udara: formatCell(row.udara),
    }));
    const exportColumns = [
      { key: "no", label: "NO." },
      { key: "tanggal", label: "TANGGAL" },
      ...COLUMNS,
    ];
    downloadReport(exportRows, exportColumns, "rekap-omset-harian.xlsx", "Rekap Omset Harian");
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Laporan Cabang
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Rekap Omset Harian
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Rekapitulasi omset harian per cabang berdasarkan metode pembayaran dan moda.
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
              Laporan Rekap Omset Harian
            </h3>
            <p className="text-sm font-semibold text-slate-600">CABANG : {cabang}</p>
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
                    Tanggal
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
                  <tr key={row.tanggal} className="transition-colors hover:bg-slate-50">
                    <td className="whitespace-nowrap border-b border-r border-slate-200 px-4 py-2.5 text-center text-slate-500">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap border-b border-r border-slate-200 px-4 py-2.5 text-slate-700">
                      {row.tanggal}
                    </td>
                    {COLUMNS.map((column) => (
                      <td
                        key={column.key}
                        className={`whitespace-nowrap border-b border-r border-slate-200 px-4 py-2.5 tabular-nums ${
                          NUMERIC_COLUMNS.has(column.key) ? "text-right" : "text-left"
                        } ${formatCell(row[column.key]) === "-" ? "text-slate-400" : "text-slate-700"}`}
                      >
                        {formatCell(row[column.key])}
                      </td>
                    ))}
                  </tr>
                ))}
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
