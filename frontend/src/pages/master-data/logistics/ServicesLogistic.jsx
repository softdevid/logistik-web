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

const config = {
  title: "Layanan Logistik",
  tabs: [
    { label: "Moda", endpoint: "modes", fields: [
      { key: "name", label: "Mode", type: "text", required: true },
      { key: "divider", label: "Divider", type: "text", required: true },
      STATUS,
    ] },
    { label: "Kategori Layanan", endpoint: "service-categories", fields: NAME_STATUS },
    { label: "Layanan Pengantaran", endpoint: "delivery-services", fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "service_category_id", label: "Service Category", type: "select",
        fetch: "service-categories", fetchLabel: "name", table: true },
      { key: "moda_id", label: "Mode", type: "select",
        fetch: "modes", fetchLabel: "name", table: true },
      STATUS,
    ] },
    { label: "Jenis Barang", endpoint: "goods-types", fields: NAME_STATUS },
    { label: "Jenis Biaya", endpoint: "cost-types", fields: NAME_STATUS },
    { label: "Termin", endpoint: "terms", fields: [
      { key: "name", label: "Days", type: "number", required: true, table: true},
      { key: "description", label: "Description", type: "text", required: true, table: true},
      STATUS
    ]},
  ],
};

export default function ServicesLogistic() {
  return <CrudTab config={config} />;
}
