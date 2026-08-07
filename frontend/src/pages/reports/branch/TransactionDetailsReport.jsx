import { ReportPage, SHIPMENT_STATUS_META } from "@/features/reports";
import { seedTransactionDetails } from "@/features/reports/data/seed";

const COLUMNS = [
  { key: "date", label: "Tanggal", type: "date", sortable: true },
  { key: "awbNo", label: "No. AWB", type: "text", sortable: true },
  { key: "doNo", label: "No. DO", type: "text", sortable: true },
  { key: "branch", label: "Cabang", type: "text", sortable: true },
  { key: "sender", label: "Pengirim", type: "text" },
  { key: "receiver", label: "Penerima", type: "text" },
  { key: "destination", label: "Tujuan", type: "text" },
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
  { label: "Total Omset", type: "sum", key: "tarif", format: "currency" },
];

export default function TransactionDetailsReport() {
  return (
    <ReportPage
      title="Detail Transaksi"
      subtitle="Rekap seluruh transaksi per cabang"
      columns={COLUMNS}
      summaries={SUMMARIES}
      seedRows={seedTransactionDetails}
      dateField="date"
      branchField="branch"
      searchFields={["awbNo", "doNo", "sender", "receiver", "destination"]}
      searchPlaceholder="Cari AWB, DO, pengirim, penerima..."
      statusMeta={SHIPMENT_STATUS_META}
      fileName="detail-transaksi.xlsx"
    />
  );
}
