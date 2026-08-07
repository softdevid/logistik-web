import { useMemo, useState } from "react";
import ManifesList from "@/features/reports/components/ManifesList";
import { seedAwbTermanifest, seedAwbTertunda } from "@/features/reports/data/seed";

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

const TERTUNDA_COLUMNS = [
  { key: "awbKoliNo", label: "AWB Koli No." },
  { key: "awbNo", label: "AWB No." },
  { key: "doNo", label: "DO No." },
  { key: "date", label: "Tanggal", type: "date" },
  { key: "tujuan", label: "Tujuan" },
  { key: "moda", label: "Moda" },
  { key: "koli", label: "Koli", type: "number" },
  { key: "berat", label: "Berat", type: "number" },
  { key: "volume", label: "Volume", type: "number" },
  { key: "totalBiaya", label: "Total Biaya", type: "currency" },
];

const TERMANIFEST_COLUMNS = [
  { key: "awbNo", label: "AWB No." },
  { key: "doNo", label: "DO No." },
  { key: "manifestNo", label: "Manifes No." },
  { key: "date", label: "Tanggal", type: "date" },
  { key: "tujuan", label: "Tujuan" },
  { key: "moda", label: "Moda" },
  { key: "koli", label: "Koli", type: "number" },
  { key: "berat", label: "Berat", type: "number" },
  { key: "volume", label: "Volume", type: "number" },
  { key: "totalBiaya", label: "Total Biaya", type: "currency" },
];

function buildSelectOptions(rows, field) {
  return [...new Set(rows.map((row) => row[field]))]
    .sort()
    .map((value) => ({ value, label: value }));
}

const TABS = [
  { id: "tertunda", label: "AWB Tertunda" },
  { id: "termanifest", label: "AWB Termanifest" },
];

export default function AwbReport() {
  const [activeTab, setActiveTab] = useState("tertunda");

  const tertundaFilters = useMemo(
    () => [{ key: "tujuan", label: "Tujuan", options: buildSelectOptions(seedAwbTertunda, "tujuan") }],
    [],
  );

  const termanifestFilters = useMemo(() => {
    const periods = [...new Set(seedAwbTermanifest.map((row) => row.date.slice(0, 7)))].sort();
    const bulanOptions = periods.map((period) => {
      const [y, m] = period.split("-");
      return { value: period, label: `${MONTH_NAMES[Number(m) - 1]} ${y}` };
    });

    return [
      { key: "bulan", label: "Bulan", options: bulanOptions },
      { key: "pengguna", label: "Pengguna", options: buildSelectOptions(seedAwbTermanifest, "pengguna") },
      { key: "tujuan", label: "Tujuan", options: buildSelectOptions(seedAwbTermanifest, "tujuan") },
    ];
  }, []);

  const tertundaRows = useMemo(
    () =>
      seedAwbTertunda.map((row) => ({
        ...row,
        bulan: row.date.slice(0, 7),
      })),
    [],
  );

  const termanifestRows = useMemo(
    () =>
      seedAwbTermanifest.map((row) => ({
        ...row,
        bulan: row.date.slice(0, 7),
      })),
    [],
  );

  return (
    <div className="min-h-full bg-slate-50 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Laporan Cabang
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">AWB</h2>
          <p className="mt-1 text-sm text-slate-500">
            Daftar Airway Bill per cabang, tertunda dan termanifest.
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

        {activeTab === "tertunda" && (
          <ManifesList
            listTitle="AWB Tertunda"
            columns={TERTUNDA_COLUMNS}
            rows={tertundaRows}
            filters={tertundaFilters}
            searchFields={["awbKoliNo", "awbNo", "doNo", "tujuan", "moda"]}
            searchPlaceholder="Cari AWB, DO, tujuan..."
            exportFileName="awb-tertunda.xlsx"
          />
        )}

        {activeTab === "termanifest" && (
          <ManifesList
            listTitle="AWB Termanifest"
            columns={TERMANIFEST_COLUMNS}
            rows={termanifestRows}
            filters={termanifestFilters}
            dateFilterField="date"
            searchFields={["awbNo", "doNo", "manifestNo", "tujuan", "moda"]}
            searchPlaceholder="Cari AWB, DO, manifes, tujuan..."
            exportFileName="awb-termanifest.xlsx"
          />
        )}
      </div>
    </div>
  );
}
