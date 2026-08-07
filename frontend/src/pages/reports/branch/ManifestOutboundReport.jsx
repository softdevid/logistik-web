import { ReportPage, MANIFEST_STATUS_META } from "@/features/reports";
import { seedManifestOutbound } from "@/features/reports/data/seed";

const COLUMNS = [
  { key: "date", label: "Tanggal", type: "date", sortable: true },
  { key: "manifestNo", label: "No. Manifest", type: "text", sortable: true },
  { key: "branch", label: "Cabang", type: "text", sortable: true },
  { key: "transit1", label: "Transit 1", type: "text" },
  { key: "transit2", label: "Transit 2", type: "text" },
  { key: "transit3", label: "Transit 3", type: "text" },
  { key: "tujuan", label: "Tujuan", type: "text" },
  { key: "driver", label: "Driver", type: "text" },
  { key: "nopol", label: "No. Polisi", type: "text" },
  { key: "totAwb", label: "Tot. AWB", type: "number", sortable: true },
  { key: "totKoli", label: "Tot. Koli", type: "number", sortable: true },
  { key: "totKg", label: "Tot. Kg", type: "number", sortable: true },
  { key: "totBiaya", label: "Tot. Biaya (Rp.)", type: "currency", sortable: true },
  { key: "status", label: "Status", type: "status", sortable: true },
];

const SUMMARIES = [
  { label: "Jumlah Manifest", type: "count", format: "number" },
  { label: "Total AWB", type: "sum", key: "totAwb", format: "number" },
  { label: "Total Kg", type: "sum", key: "totKg", format: "number" },
  { label: "Total Biaya", type: "sum", key: "totBiaya", format: "currency" },
];

export default function ManifestOutboundReport() {
  return (
    <ReportPage
      title="Manifest Outbound"
      subtitle="Rekap manifest pengiriman keluar per cabang"
      columns={COLUMNS}
      summaries={SUMMARIES}
      seedRows={seedManifestOutbound}
      dateField="date"
      branchField="branch"
      searchFields={["manifestNo", "driver", "nopol", "tujuan"]}
      searchPlaceholder="Cari manifest, driver, tujuan..."
      statusMeta={MANIFEST_STATUS_META}
      fileName="manifest-outbound.xlsx"
    />
  );
}
