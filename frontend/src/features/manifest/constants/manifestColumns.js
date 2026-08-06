export const MANIFEST_COLUMNS = [
  { key: "manifestNo", label: "Manifest No", sortable: true },
  { key: "date", label: "Tanggal", sortable: true },
  { key: "transit1", label: "Transit 1" },
  { key: "transit2", label: "Transit 2" },
  { key: "transit3", label: "Transit 3" },
  { key: "transit4", label: "Transit 4" },
  { key: "transit5", label: "Transit 5" },
  { key: "tujuan", label: "Tujuan" },
  { key: "status", label: "Status", sortable: true },
  { key: "totAwb", label: "Tot. AWB", sortable: true },
  { key: "totKoli", label: "Tot. Koli", sortable: true },
  { key: "totKg", label: "Tot. Kg", sortable: true },
  { key: "totVolume", label: "Tot. Volume", sortable: true },
  { key: "totBiaya", label: "Tot. Biaya (Rp.)", sortable: true },
  { key: "kendaraan", label: "Kendaraan" },
];

export const MANIFEST_SORTABLE_KEYS = {
  manifestNo: "text",
  date: "date",
  status: "text",
  totAwb: "number",
  totKoli: "number",
  totKg: "number",
  totVolume: "number",
  totBiaya: "number",
};
