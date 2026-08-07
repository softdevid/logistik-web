import { useMemo, useState } from "react";
import { ArrowDownTrayIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Badge from "@/features/reports/components/Badge";
import {
  formatReportCurrency,
  formatReportDate,
  formatReportNumber,
  formatReportPercent,
  toNumber,
} from "@/features/reports/utils/formatters";
import { downloadReport } from "@/features/reports/utils/excel";
import {
  seedApAging,
  seedApDetail,
  seedArAging,
  seedArDetail,
} from "@/features/reports/data/seed";

const COMPANY_NAME = "PT Roda Esa Dinamika";

const DETAIL_STATUS_META = {
  "Belum Lunas": { label: "Belum Lunas", className: "bg-rose-50 text-rose-700 ring-rose-200" },
  Lunas: { label: "Lunas", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
};

const DETAIL_COLUMNS = [
  { key: "penjual", label: "PENJUAL" },
  { key: "noFaktur", label: "NO FAKTUR" },
  { key: "tanggal", label: "TANGGAL", type: "date" },
  { key: "status", label: "STATUS" },
  { key: "totalBiaya", label: "TOTAL BIAYA", type: "currency", align: "right" },
];

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

const TABS = [
  { id: "ar", label: "Laporan AR" },
  { id: "ap", label: "Laporan AP" },
];

const AR_CONFIG = {
  id: "ar",
  entityLabel: "Pelanggan",
  entityAll: "Semua Pelanggan",
  recapTitle: "REKAP AGING PELANGGAN",
  recapSubtitle: "BELUM LUNAS",
  recapSeed: seedArAging,
  detailSeed: seedArDetail,
  recapColumns: [
    { key: "tanggalFaktur", label: "TANGGAL FAKTUR", type: "date" },
    { key: "noKwt", label: "NO KWT/INV" },
    { key: "tanggalTerimaFaktur", label: "TANGGAL TERIMA FAKTUR", type: "date" },
    { key: "namaPenerimaFaktur", label: "NAMA PENERIMA FAKTUR" },
    { key: "namaPerusahaan", label: "NAMA PERUSAHAAN" },
    { key: "jumlahTagihan", label: "JUMLAH TAGIHAN", type: "currency", align: "right" },
    { key: "ketentuan", label: "KETENTUAN" },
    { key: "usiaFaktur", label: "USIA FAKTUR", type: "number", align: "right" },
    { key: "b0_21", label: "0 S/D 21 HARI", type: "currency", align: "right" },
    { key: "b21_30", label: "> 21 HARI = 30 HARI", type: "currency", align: "right" },
    { key: "b30plus", label: "> 30 HARI", type: "currency", align: "right" },
  ],
  bucketKeys: ["b0_21", "b21_30", "b30plus"],
  filePrefix: "laporan-ar-rekap-aging-pelanggan",
  sheetName: "Rekap Aging Pelanggan",
};

const AP_CONFIG = {
  id: "ap",
  entityLabel: "Pemasok",
  entityAll: "Semua Pemasok",
  recapTitle: "REKAP AGING PEMASOK",
  recapSubtitle: null,
  recapSeed: seedApAging,
  detailSeed: seedApDetail,
  recapColumns: [
    { key: "namaPerusahaan", label: "NAMA PERUSAHAAN" },
    { key: "noKwt", label: "NO KWT/INV" },
    { key: "tanggalFaktur", label: "TANGGAL FAKTUR", type: "date" },
    { key: "atas", label: "ATAS" },
    { key: "batasWaktu", label: "BATAS WAKTU", type: "date" },
    { key: "jumlahTagihan", label: "JUMLAH TAGIHAN", type: "currency", align: "right" },
    { key: "b0_30", label: "0-30", type: "currency", align: "right" },
    { key: "b31_60", label: "31-60", type: "currency", align: "right" },
    { key: "b61_90", label: "61-90", type: "currency", align: "right" },
    { key: "b90plus", label: "> 90", type: "currency", align: "right" },
    { key: "keterangan", label: "KETERANGAN" },
  ],
  bucketKeys: ["b0_30", "b31_60", "b61_90", "b90plus"],
  filePrefix: "laporan-ap-rekap-aging-pemasok",
  sheetName: "Rekap Aging Pemasok",
};

const filterClass =
  "rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-[#0F5C4C] focus:ring-2 focus:ring-[#0F5C4C]/20";

function cell(value) {
  if (value === null || value === undefined || value === "") return "-";
  return value;
}

function formatPeriodDay(dateStr) {
  if (!dateStr) return "-";
  const [y, m, d] = dateStr.split("-");
  return `${d}-${Number(m)}-${y}`;
}

function lastDayOfMonth(year, month) {
  return new Date(year, Number(month), 0).getDate();
}

function formatCellValue(value, type) {
  if (type === "date") return formatReportDate(value);
  if (type === "currency") return formatReportCurrency(value);
  if (type === "number") return formatReportNumber(value);
  return cell(value);
}

function bucketPercentages(rows, bucketKeys) {
  const total = rows.reduce((sum, row) => sum + toNumber(row.jumlahTagihan), 0);
  return bucketKeys.map((key) => {
    const bucket = rows.reduce((sum, row) => sum + toNumber(row[key]), 0);
    const percent = total > 0 ? (bucket / total) * 100 : 0;
    return formatReportPercent(percent);
  });
}

function FinanceTab({ config }) {
  const [bulan, setBulan] = useState("08");
  const [tahun, setTahun] = useState("2026");
  const [entity, setEntity] = useState("all");
  const [shown, setShown] = useState(false);
  const [detailTab, setDetailTab] = useState("Belum Lunas");
  const [showCount, setShowCount] = useState(10);
  const [page, setPage] = useState(1);

  const periodOptions = useMemo(() => {
    const periods = new Set();
    [...config.recapSeed, ...config.detailSeed].forEach((row) => periods.add(row.bulan));
    return [...periods].sort();
  }, [config]);

  const tahunOptions = useMemo(
    () => [...new Set(periodOptions.map((period) => period.split("-")[0]))].sort(),
    [periodOptions],
  );

  const entityOptions = useMemo(
    () => [...new Set(config.recapSeed.map((row) => row.namaPerusahaan))].sort(),
    [config],
  );

  const period = `${tahun}-${bulan}`;
  const startDate = `${period}-01`;
  const endDate = `${period}-${String(lastDayOfMonth(tahun, bulan)).padStart(2, "0")}`;

  const recapRows = useMemo(
    () =>
      config.recapSeed.filter(
        (row) => row.bulan === period && (entity === "all" || row.namaPerusahaan === entity),
      ),
    [config, period, entity],
  );

  const detailRows = useMemo(
    () =>
      config.detailSeed.filter(
        (row) => row.bulan === period && (entity === "all" || row.perusahaan === entity),
      ),
    [config, period, entity],
  );

  const statusRows = useMemo(
    () => detailRows.filter((row) => row.status === detailTab),
    [detailRows, detailTab],
  );

  const statusTotal = useMemo(
    () => statusRows.reduce((sum, row) => sum + toNumber(row.totalBiaya), 0),
    [statusRows],
  );

  const totalPages = Math.max(1, Math.ceil(statusRows.length / showCount));
  const safePage = Math.min(page, totalPages);
  const pagedRows = useMemo(
    () => statusRows.slice((safePage - 1) * showCount, safePage * showCount),
    [statusRows, safePage, showCount],
  );

  const percentages = useMemo(
    () => bucketPercentages(recapRows, config.bucketKeys),
    [recapRows, config],
  );

  const preBucketCount = config.recapColumns.length - config.bucketKeys.length;

  function handleReset() {
    setBulan("08");
    setTahun("2026");
    setEntity("all");
    setShown(false);
    setDetailTab("Belum Lunas");
    setShowCount(10);
    setPage(1);
  }

  function handleShow() {
    setShown(true);
  }

  function handleExportRecap() {
    const totalTagihan = recapRows.reduce((sum, row) => sum + toNumber(row.jumlahTagihan), 0);
    const exportRows = recapRows.map((row, index) => {
      const record = { no: index + 1 };
      config.recapColumns.forEach((column) => {
        record[column.label] = formatCellValue(row[column.key], column.type);
      });
      return record;
    });
    exportRows.push({
      no: "HASIL AKHIR",
      ...Object.fromEntries(
        config.recapColumns.map((column, index) => {
          if (index < preBucketCount) return [column.label, ""];
          const bucket = recapRows.reduce(
            (sum, row) => sum + toNumber(row[config.bucketKeys[index - preBucketCount]]),
            0,
          );
          return [
            column.label,
            totalTagihan > 0 ? formatReportPercent((bucket / totalTagihan) * 100) : "NAN%",
          ];
        }),
      ),
    });
    const exportColumns = [
      { key: "no", label: "NO" },
      ...config.recapColumns.map((column) => ({ key: column.label, label: column.label })),
    ];
    const fileName = `${config.filePrefix}-${period}.xlsx`;
    downloadReport(exportRows, exportColumns, fileName, config.sheetName);
  }

  function handleExportDetail() {
    const exportRows = statusRows.map((row) => ({
      penjual: cell(row.penjual),
      noFaktur: cell(row.noFaktur),
      tanggal: formatReportDate(row.tanggal),
      status: DETAIL_STATUS_META[row.status]?.label ?? cell(row.status),
      totalBiaya: formatReportCurrency(row.totalBiaya),
    }));
    const exportColumns = [
      { key: "penjual", label: "Penjual" },
      { key: "noFaktur", label: "No Faktur" },
      { key: "tanggal", label: "Tanggal" },
      { key: "status", label: "Status" },
      { key: "totalBiaya", label: "Total Biaya" },
    ];
    downloadReport(exportRows, exportColumns, `${config.filePrefix}-detail-${detailTab}.xlsx`, config.sheetName);
  }

  return (
    <div className="flex flex-col gap-5">
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
                {periodOptions.map((periodOption) => {
                  const month = periodOption.split("-")[1];
                  return (
                    <option key={periodOption} value={month}>
                      {MONTH_NAMES[Number(month) - 1]}
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
                {tahunOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-slate-600">{config.entityLabel}</span>
              <select
                value={entity}
                onChange={(e) => setEntity(e.target.value)}
                className={filterClass}
              >
                <option value="all">{config.entityAll}</option>
                {entityOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleShow}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5C4C] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0C4A3D]"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              Show
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleExportRecap}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      {shown && (
        <>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
              <p className="text-center text-base font-bold uppercase tracking-wide text-slate-900 sm:text-lg">
                {config.recapTitle}
                {config.recapSubtitle ? `, ${config.recapSubtitle}` : ""}
              </p>
              <p className="mt-1 text-center text-sm font-semibold text-slate-700">{COMPANY_NAME}</p>
              <p className="text-center text-sm text-slate-500">( IDR )</p>
              <div className="mt-4 flex flex-col gap-1 text-sm text-slate-700">
                <p>
                  {config.entityLabel} :{" "}
                  <span className="font-medium">{entity === "all" ? config.entityAll : entity}</span>
                </p>
                <p>
                  Tanggal Mulai : <span className="font-medium">{formatPeriodDay(startDate)}</span>
                </p>
                <p>
                  Tanggal Akhir : <span className="font-medium">{formatPeriodDay(endDate)}</span>
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/95">
                    <th className="whitespace-nowrap px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                      NO
                    </th>
                    {config.recapColumns.map((column) => (
                      <th
                        key={column.key}
                        className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                          column.align === "right" ? "text-right" : "text-left"
                        }`}
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {recapRows.map((row, index) => (
                    <tr key={row.id} className="transition-colors hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-2.5 text-center text-slate-700">
                        {index + 1}
                      </td>
                      {config.recapColumns.map((column) => {
                        const value = formatCellValue(row[column.key], column.type);
                        return (
                          <td
                            key={column.key}
                            className={`whitespace-nowrap px-4 py-2.5 ${
                              column.align === "right"
                                ? "text-right tabular-nums"
                                : "text-left"
                            } ${value === "-" ? "text-slate-400" : "text-slate-700"}`}
                          >
                            {value}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {recapRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={config.recapColumns.length + 1}
                        className="px-4 py-10 text-center text-sm text-slate-400"
                      >
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
                {recapRows.length > 0 && (
                  <tfoot>
                    <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
                      <td colSpan={preBucketCount + 1} className="px-4 py-3 text-sm text-slate-900">
                        HASIL AKHIR
                      </td>
                      {percentages.map((percent, index) => (
                        <td
                          key={index}
                          className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-900"
                        >
                          {percent}
                        </td>
                      ))}
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center gap-2">
                <p className="text-base font-semibold text-slate-900">Detail Tagihan</p>
                <div className="flex items-center gap-2">
                  {["Belum Lunas", "Lunas"].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setDetailTab(status);
                        setPage(1);
                      }}
                      className={`rounded-xl px-3 py-1.5 text-sm font-medium transition-colors ${
                        detailTab === status
                          ? "bg-[#0F5C4C] text-white shadow-sm"
                          : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  Show
                  <select
                    value={showCount}
                    onChange={(e) => {
                      setShowCount(Number(e.target.value));
                      setPage(1);
                    }}
                    className={filterClass}
                  >
                    {[10, 25, 50].map((count) => (
                      <option key={count} value={count}>
                        {count}
                      </option>
                    ))}
                  </select>
                  data
                </label>
                <button
                  type="button"
                  onClick={handleExportDetail}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5C4C] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0C4A3D]"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Export Excel
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/95">
                    {DETAIL_COLUMNS.map((column) => (
                      <th
                        key={column.key}
                        className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                          column.align === "right" ? "text-right" : "text-left"
                        }`}
                      >
                        {column.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {pagedRows.map((row) => (
                    <tr key={row.id} className="transition-colors hover:bg-slate-50">
                      <td className="whitespace-nowrap px-4 py-2.5 text-slate-700">{cell(row.penjual)}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-slate-700">{cell(row.noFaktur)}</td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-slate-700">
                        {formatReportDate(row.tanggal)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5">
                        <Badge value={row.status} meta={DETAIL_STATUS_META} />
                      </td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-slate-700">
                        {formatReportCurrency(row.totalBiaya)}
                      </td>
                    </tr>
                  ))}
                  {pagedRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={DETAIL_COLUMNS.length}
                        className="px-4 py-10 text-center text-sm text-slate-400"
                      >
                        No data available in table
                      </td>
                    </tr>
                  )}
                </tbody>
                {statusRows.length > 0 && (
                  <tfoot>
                    <tr className="border-t border-slate-200 bg-slate-50 font-semibold">
                      <td colSpan={DETAIL_COLUMNS.length - 1} className="px-4 py-3 text-sm text-slate-900">
                        TOTAL
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-900">
                        {formatReportCurrency(statusTotal)}
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-sm text-slate-500">
                Menampilkan {statusRows.length === 0 ? 0 : (safePage - 1) * showCount + 1} sampai{" "}
                {Math.min(safePage * showCount, statusRows.length)} dari {statusRows.length} data
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setPage(safePage - 1)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Sebelumnya
                </button>
                <span className="text-sm text-slate-600">
                  Halaman {safePage} dari {totalPages}
                </span>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage(safePage + 1)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Berikutnya
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function FinancialReport() {
  const [activeTab, setActiveTab] = useState("ar");

  return (
    <div className="min-h-full bg-slate-50 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Laporan
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Laporan Keuangan
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Rekap aging piutang (AR) dan aging utang (AP).
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

        {activeTab === "ar" && <FinanceTab config={AR_CONFIG} />}
        {activeTab === "ap" && <FinanceTab config={AP_CONFIG} />}
      </div>
    </div>
  );
}
