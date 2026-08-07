import { ReportPage } from "@/features/reports";
import { seedRekapGrossProfit } from "@/features/reports/data/seed";

const ORIGIN_OPTIONS = [...new Set(seedRekapGrossProfit.map((row) => row.origin))]
  .sort()
  .map((origin) => ({ value: origin, label: origin }));

const COLUMNS = [
  { key: "nopol", label: "No. Polisi", type: "text", sortable: true },
  { key: "manifestNo", label: "No. Manifests", type: "text", sortable: true },
  { key: "tujuan", label: "Tujuan", type: "text" },
  { key: "driver", label: "Driver", type: "text" },
  { key: "date", label: "Tgl. Manifests", type: "date", sortable: true },
  { key: "createdBy", label: "Dibuat Oleh", type: "text" },
];

export default function RekapGrossProfitReport() {
  return (
    <ReportPage
      title="Rekap Gross Profit"
      subtitle="Rekap manifest untuk perhitungan gross profit"
      columns={COLUMNS}
      seedRows={seedRekapGrossProfit}
      dateField="date"
      branchField="branch"
      selectFilters={[{ key: "origin", label: "Origin", options: ORIGIN_OPTIONS }]}
      searchFields={["nopol", "manifestNo", "tujuan", "driver", "createdBy"]}
      searchPlaceholder="Cari no. polisi, no. manifest, tujuan, driver..."
      fileName="rekap-gross-profit.xlsx"
    />
  );
}
