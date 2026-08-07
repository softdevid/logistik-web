import { useMemo } from "react";
import ManifesList from "@/features/reports/components/ManifesList";
import { PAYMENT_STATUS_META } from "@/features/reports";
import { seedManifestVendor } from "@/features/reports/data/seed";

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
  { key: "manifestNo", label: "Manifes No." },
  { key: "date", label: "Tanggal", type: "date" },
  { key: "asal", label: "Asal" },
  { key: "penjual", label: "Penjual" },
  { key: "totAwb", label: "Tot. AWB", type: "number" },
  { key: "totKoli", label: "Tot. Koli", type: "number" },
  { key: "totBerat", label: "Tot. Berat", type: "number" },
  { key: "totVolume", label: "Tot. Volume", type: "number" },
  { key: "totBiaya", label: "Tot. Biaya (Rp.)", type: "currency" },
  { key: "kendaraan", label: "Kendaraan" },
  { key: "sopir", label: "Sopir" },
  { key: "status", label: "Status", type: "status" },
];

export default function ManifestVendorReport() {
  const filters = useMemo(() => {
    const periods = new Set(seedManifestVendor.map((row) => row.date.slice(0, 7)));
    const months = [...periods].sort().map((period) => {
      const [y, m] = period.split("-");
      return { value: period, label: `${MONTH_NAMES[Number(m) - 1]} ${y}` };
    });

    const years = new Set(seedManifestVendor.map((row) => row.date.slice(0, 4)));
    const yearOptions = [...years].sort().map((y) => ({ value: y, label: y }));

    const penjual = [...new Set(seedManifestVendor.map((row) => row.penjual))]
      .sort()
      .map((penjualName) => ({ value: penjualName, label: penjualName }));

    const pengguna = [...new Set(seedManifestVendor.map((row) => row.pengguna))]
      .sort()
      .map((penggunaName) => ({ value: penggunaName, label: penggunaName }));

    return [
      { key: "bulan", label: "Bulan", options: months },
      { key: "tahun", label: "Tahun", options: yearOptions },
      { key: "penjual", label: "Penjual", options: penjual },
      { key: "pengguna", label: "Pengguna", options: pengguna },
    ];
  }, []);

  const rows = useMemo(
    () =>
      seedManifestVendor.map((row) => ({
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
            Penjual Manifes
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Daftar manifes yang dijual oleh vendor/penjual.
          </p>
        </div>

        <ManifesList
          columns={COLUMNS}
          rows={rows}
          filters={filters}
          searchFields={["manifestNo", "asal", "penjual", "kendaraan", "sopir"]}
          searchPlaceholder="Cari no. manifes, asal, penjual..."
          statusMeta={PAYMENT_STATUS_META}
          exportFileName="manifest-vendor.xlsx"
          detailFields={(row) => [
            { label: "Rute", value: row.transit.join(" -> ") },
            { label: "Pengguna", value: row.pengguna },
          ]}
        />
      </div>
    </div>
  );
}
