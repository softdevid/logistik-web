import CrudTab from "../../../components/CrudTab";

const STATUS = {
  key: "status",
  label: "Status",
  type: "select",
  options: ["Active", "Inactive"],
  default: "Active",
  badge: true,
};

const config = {
  title: "Divisi Logistik",
  tabs: [
    {
      label: "Pemasaran",
      endpoint: "marketing",
      fields: [
        { key: "name", label: "Nama", type: "text", required: true },
        { key: "address", label: "Alamat", type: "text", table: true },
        { key: "ktp", label: "KTP", type: "text", table: true },
        { key: "phone", label: "No. Telp", type: "text", table: true },
        { key: "branch_id", label: "Cabang", type: "select",
          fetch: "branches", fetchLabel: "nama", table: true },
        STATUS,
      ],
    },
    {
      label: "Driver",
      endpoint: "drivers",
      fields: [
        { key: "name", label: "Nama", type: "text", required: true },
        { key: "address", label: "Alamat", type: "text", table: true },
        { key: "ktp", label: "KTP", type: "text", table: true },
        { key: "sim", label: "SIM", type: "text", table: true },
        { key: "phone", label: "Telp No.", type: "text", table: true },
        { key: "branch_id", label: "Cabang", type: "select",
          fetch: "branches", fetchLabel: "nama", table: true },
        STATUS,
      ],
    },
    {
      label: "Kurir",
      endpoint: "couriers",
      fields: [
        { key: "name", label: "Nama", type: "text", required: true },
        { key: "address", label: "Alamat", type: "text", table: true },
        { key: "ktp", label: "KTP", type: "text", table: true },
        { key: "phone", label: "Telp No.", type: "text", table: true },
        { key: "branch_id", label: "Cabang", type: "select",
          fetch: "branches", fetchLabel: "nama", table: true },
        STATUS,
      ],
    },
  ],
};

export default function DivisionLogistic() {
  return <CrudTab config={config} />;
}
