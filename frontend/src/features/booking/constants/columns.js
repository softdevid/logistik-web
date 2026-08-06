export const columns = [
  { key: "id", label: "ID" },
  { key: "bookingNo", label: "AWB No." },
  { key: "date", label: "Tanggal" },
  { key: "origin", label: "DO No." },
  { key: "destination", label: "Tujuan" },
  { key: "sender", label: "Pengirim" },
  { key: "receiver", label: "Penerima" },
  { key: "koli", label: "Koli" },
  { key: "kilo", label: "Kilo" },
  { key: "volume", label: "Volume" },
  { key: "tarif", label: "Trarif (Rp.)" },
  { key: "madeBy", label: "Dibuat Oleh" },
  { key: "status", label: "Status" },
  { key: "courier", label: "Kurir" },
];

export const SORTABLE_COLUMNS = columns.reduce((acc, { key, label }) => {
  acc[key] = label;
  return acc;
}, {});