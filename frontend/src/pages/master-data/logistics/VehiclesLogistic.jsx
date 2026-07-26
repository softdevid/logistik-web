import CrudTab from "../../../components/CrudTab";

const STATUS = {
  key: "status",
  label: "Status",
  type: "select",
  options: ["Active", "Inactive"],
  default: "Active",
  badge: true,
};

const NAME_STATUS = [
  { key: "name", label: "Name", type: "text", required: true },
  STATUS,
];

const YEAR_OPTIONS = (() => {
  const now = new Date().getFullYear();
  const yrs = [];
  for (let y = now; y >= 2006; y--) yrs.push(String(y));
  return yrs;
})();

const config = {
  title: "Kendaraan Logistik",
  tabs: [
    {
      label: "Kendaraan",
      endpoint: "vehicles",
      fields: [
        { key: "name", label: "Name", type: "text", required: true },
        { key: "jenis_trucking_id", label: "Jenis", type: "select",
          fetch: "trucking-types", fetchLabel: "name", table: true },
        { key: "year", label: "Tahun", type: "select", options: YEAR_OPTIONS },
        { key: "no_polisi", label: "No. Polisi", type: "text" },
        { key: "stnk_name", label: "Nama STNK", type: "text", table: true },
        { key: "stnk_number", label: "No. STNK", type: "text" },
        { key: "stnk_date", label: "STNK Date", type: "date" },
        { key: "cylinder_capacity", label: "Isi Silinder", type: "text" },
        { key: "color", label: "Warna", type: "text" },
        { key: "insurance_name", label: "Nama Asuransi", type: "text" },
        { key: "insurance_expiry", label: "Tgl Habis Asuransi", type: "date" },
        { key: "description", label: "Keterangan", type: "text", table: true },
        { key: "chassis_number", label: "No. Rangka", type: "text" },
        { key: "engine_number", label: "No. Mesin", type: "text" },
        { key: "is_active", label: "Active", type: "checkbox", default: true, checkLabel: "Active", table: true },
        { key: "service_trucking", label: "Service Trucing", type: "checkbox", checkLabel: "Service Trucing", table: true },
        { key: "branch_id", label: "Branch", type: "select",
          fetch: "cabangs", fetchLabel: "nama", table: true },
      ],
    },
    { label: "Jenis Kendaraan", endpoint: "vehicle-types", fields: NAME_STATUS },
    { label: "Jenis Trucking", endpoint: "trucking-types", fields: NAME_STATUS },
  ],
};

export default function VehiclesLogistic() {
  return <CrudTab config={config} />;
}
