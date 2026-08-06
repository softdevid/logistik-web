import { ArrowDownTrayIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export const CONSIGNEE_CONFIG = {
  label: "Consignee",
  searchPlaceholder: "Cari consignee...",
  lastIdLabel: "Consignee",
  seed: [
    {
      id: 88,
      name: "PT Kirim Lancar",
      phone: "021-9000-0088",
      customer: "PT Sinar Logistik Utama",
      branch: "Jakarta Barat",
      status: "Active",
    },
    {
      id: 87,
      name: "CV Gerak Cepat",
      phone: "031-9000-0087",
      customer: "CV Maju Bersama",
      branch: "Surabaya",
      status: "Active",
    },
    {
      id: 86,
      name: "UD Sampurna",
      phone: "022-9000-0086",
      customer: "UD Nusantara Sejahtera",
      branch: "Bandung",
      status: "Inactive",
    },
  ],
  fields: [
    { key: "name", label: "Nama", required: true },
    { key: "phone", label: "No. Telp", required: true },
    { key: "customer", label: "Customer", required: true },
    { key: "branch", label: "Cabang", required: true },
    {
      key: "status",
      label: "Status",
      required: true,
      type: "select",
      options: ["Active", "Inactive"],
    },
  ],
  columns: [
    { key: "id", label: "ID", width: "w-20" },
    { key: "name", label: "Nama" },
    { key: "phone", label: "No. Telp" },
    { key: "customer", label: "Customer" },
    { key: "branch", label: "Cabang" },
    { key: "status", label: "Status", badge: true },
  ],
  rowActions: [
    { key: "edit", label: "Edit", icon: PencilSquareIcon },
    { key: "delete", label: "Delete", icon: TrashIcon, destructive: true },
  ],
  tools: [
    {
      key: "template",
      label: "Download Import Template",
      icon: ArrowDownTrayIcon,
    },
    { key: "import", label: "Import Data" },
    { key: "export", label: "Export Data" },
  ],
  emptyForm: {
    name: "",
    phone: "",
    customer: "",
    branch: "",
    status: "Active",
  },
  editTitle: "Consignee",
};
