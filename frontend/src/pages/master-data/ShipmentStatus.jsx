import CrudTab from "../../components/CrudTab";

const STATUS = {
  key: "status",
  label: "Status",
  type: "select",
  options: ["Active", "Inactive"],
  default: "Active",
  badge: true,
};

const config = {
  title: "Shipment Status",
  tabs: [
    {
      label: "Shipment Status",
      endpoint: "shipment-statuses",
      fields: [
        { key: "code", label: "Kode", type: "text", required: true },
        { key: "name", label: "Nama Status", type: "text", required: true },
        STATUS,
      ],
    },
  ],
};

export default function ShipmentStatus() {
  return <CrudTab config={config} />;
}
