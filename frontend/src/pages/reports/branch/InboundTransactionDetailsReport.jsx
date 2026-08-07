import { ReportPage, SHIPMENT_STATUS_META } from "@/features/reports";
import { seedInboundTransactionDetails } from "@/features/reports/data/seed";

const COLUMNS = [
  { key: "date", label: "Tanggal", type: "date", sortable: true },
  { key: "awbNo", label: "No. AWB", type: "text", sortable: true },
  { key: "manifestNo", label: "No. Manifest", type: "text", sortable: true },
  { key: "sender", label: "Pengirim", type: "text" },
  { key: "receiver", label: "Penerima", type: "text" },
  { key: "origin", label: "Asal", type: "text" },
  { key: "koli", label: "Koli", type: "number", sortable: true },
  { key: "kilo", label: "Kg", type: "number", sortable: true },
  { key: "volume", label: "Volume", type: "number", sortable: true },
  { key: "tarif", label: "Tarif (Rp.)", type: "currency", sortable: true },
  { key: "status", label: "Status", type: "status", sortable: true },
];

const SUMMARIES = [
  { label: "Total Transaksi", type: "count", format: "number" },
  { label: "Total Koli", type: "sum", key: "koli", format: "number" },
  { label: "Total Kg", type: "sum", key: "kilo", format: "number" },
  { label: "Total Biaya", type: "sum", key: "tarif", format: "currency" },
];

export default function InboundTransactionDetailsReport() {
  return (
    <ReportPage
      title="Detail Transaksi Inbound"
      subtitle="Rekap transaksi barang masuk per cabang"
      columns={COLUMNS}
      summaries={SUMMARIES}
      seedRows={seedInboundTransactionDetails}
      dateField="date"
      searchFields={["awbNo", "manifestNo", "sender", "receiver", "origin"]}
      searchPlaceholder="Cari AWB, manifest, pengirim, penerima..."
      statusMeta={SHIPMENT_STATUS_META}
      fileName="detail-transaksi-inbound.xlsx"
    />
  );
}
