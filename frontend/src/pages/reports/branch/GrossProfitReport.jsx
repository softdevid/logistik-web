import { useMemo } from "react";
import ManifesList from "@/features/reports/components/ManifesList";
import Badge from "@/features/reports/components/Badge";
import { seedGrossProfitManifests } from "@/features/reports/data/seed";

const STATUS_OPTIONS = [
  { value: "Destination", label: "Destination" },
  { value: "Transit", label: "Transit" },
  { value: "Vendor", label: "Vendor" },
];

const STATUS_META = {
  Destination: { label: "Destination", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  Transit: { label: "Transit", className: "bg-sky-50 text-sky-700 ring-sky-200" },
  Vendor: { label: "Vendor", className: "bg-violet-50 text-violet-700 ring-violet-200" },
};

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

const MANIFEST_COLUMNS = [
  { key: "manifestNo", label: "Manifest No." },
  { key: "date", label: "Tanggal", type: "date" },
  { key: "tujuan", label: "Tujuan" },
  { key: "totAwb", label: "Tot. AWB", type: "number" },
  { key: "totKoli", label: "Tot. Koli", type: "number" },
  { key: "totKg", label: "Tot. Kg", type: "number" },
  { key: "totVolume", label: "Tot. Volume", type: "number" },
  { key: "totBiaya", label: "Tot. Biaya (Rp.)", type: "currency" },
  { key: "kendaraan", label: "Kendaraan" },
  { key: "driver", label: "Driver" },
];

export default function GrossProfitReport() {
  const filters = useMemo(() => {
    const periods = new Set(seedGrossProfitManifests.map((row) => row.date.slice(0, 7)));
    const months = [...periods].sort().map((period) => {
      const [y, m] = period.split("-");
      return { value: period, label: `${MONTH_NAMES[Number(m) - 1]} ${y}` };
    });

    const years = new Set(seedGrossProfitManifests.map((row) => row.date.slice(0, 4)));
    const yearOptions = [...years].sort().map((y) => ({ value: y, label: y }));

    return [
      { key: "bulan", label: "Bulan", options: months },
      { key: "tahun", label: "Tahun", options: yearOptions },
      { key: "status", label: "Status", options: STATUS_OPTIONS },
    ];
  }, []);

  const rows = useMemo(
    () =>
      seedGrossProfitManifests.map((row) => ({
        ...row,
        bulan: row.date.slice(0, 7),
        tahun: row.date.slice(0, 4),
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
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Gross Profit
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Rekap laba kotor dan daftar manifest per cabang.
          </p>
        </div>

        <ManifesList
          columns={MANIFEST_COLUMNS}
          rows={rows}
          filters={filters}
          searchFields={["manifestNo", "tujuan", "kendaraan", "driver"]}
          searchPlaceholder="Cari manifest, tujuan, driver..."
          exportFileName="gross-profit-manifests.xlsx"
          detailFields={(row) => [
            {
              label: "Status",
              value: <Badge value={row.status} meta={STATUS_META} />,
            },
            { label: "Rute", value: row.transit.join(" -> ") },
            { label: "Tujuan", value: row.tujuan },
          ]}
        />
      </div>
    </div>
  );
}
