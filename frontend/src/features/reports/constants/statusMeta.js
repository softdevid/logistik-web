export const SHIPMENT_STATUS_META = {
  Open: { label: "Open", className: "bg-sky-50 text-sky-700 ring-sky-200" },
  "In Transit": {
    label: "In Transit",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  Delivered: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  Cancelled: {
    label: "Cancelled",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
  },
};

export const MANIFEST_STATUS_META = {
  Draft: { label: "Draft", className: "bg-slate-100 text-slate-600 ring-slate-200" },
  Transit: { label: "Transit", className: "bg-sky-50 text-sky-700 ring-sky-200" },
  Inbound: { label: "Inbound", className: "bg-violet-50 text-violet-700 ring-violet-200" },
  Completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
};

export const DELIVERY_STATUS_META = {
  "Dalam Proses": {
    label: "Dalam Proses",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  Selesai: { label: "Selesai", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  Gagal: { label: "Gagal", className: "bg-rose-50 text-rose-700 ring-rose-200" },
};

export const PAYMENT_STATUS_META = {
  Lunas: { label: "Lunas", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  "Belum Dibayar": {
    label: "Belum Dibayar",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
  },
  Sebagian: {
    label: "Sebagian",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
};
