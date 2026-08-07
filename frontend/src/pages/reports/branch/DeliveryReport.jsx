import { ReportPage, DELIVERY_STATUS_META } from "@/features/reports";
import { seedDeliveries } from "@/features/reports/data/seed";

const COLUMNS = [
  { key: "date", label: "Tanggal", type: "date", sortable: true },
  { key: "awbNo", label: "No. AWB", type: "text", sortable: true },
  { key: "receiver", label: "Penerima", type: "text" },
  { key: "address", label: "Alamat Tujuan", type: "text" },
  { key: "destination", label: "Kota Tujuan", type: "text" },
  { key: "courier", label: "Kurir", type: "text" },
  { key: "kendaraan", label: "Kendaraan", type: "text" },
  { key: "sentAt", label: "Waktu Kirim", type: "text" },
  { key: "receivedAt", label: "Waktu Terima", type: "text" },
  { key: "status", label: "Status", type: "status", sortable: true },
];

const SUMMARIES = [
  { label: "Total Pengantaran", type: "count", format: "number" },
  { label: "Selesai", type: "countIf", key: "status", value: "Selesai", format: "number" },
  { label: "Dalam Proses", type: "countIf", key: "status", value: "Dalam Proses", format: "number" },
  { label: "Gagal", type: "countIf", key: "status", value: "Gagal", format: "number" },
];

export default function DeliveryReport() {
  return (
    <ReportPage
      title="Pengantaran"
      subtitle="Rekap proses pengantaran per kurir"
      columns={COLUMNS}
      summaries={SUMMARIES}
      seedRows={seedDeliveries}
      dateField="date"
      searchFields={["awbNo", "receiver", "address", "courier", "kendaraan"]}
      searchPlaceholder="Cari AWB, penerima, kurir..."
      statusMeta={DELIVERY_STATUS_META}
      fileName="pengantaran.xlsx"
    />
  );
}
