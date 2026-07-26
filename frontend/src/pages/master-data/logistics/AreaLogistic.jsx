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
  title: "Logistik",
  tabs: [
    {
      label: "Provinsi",
      endpoint: "provinces",
      fields: [
        { key: "name", label: "Name", type: "text", required: true },
        STATUS,
      ],
    },
    {
      label: "Kabupaten",
      endpoint: "regencies",
      fields: [
        { key: "name", label: "Name", type: "text", required: true },
        STATUS,
      ],
    },
    {
      label: "Kecamatan",
      endpoint: "districts",
      fields: [
        { key: "name", label: "Name", type: "text", required: true },
        STATUS,
      ],
    },
    {
      label: "Kelurahan",
      endpoint: "villages",
      fields: [
        { key: "name", label: "Name", type: "text", required: true },
        STATUS,
      ],
    },
    {
      label: "Kode Pos",
      endpoint: "postal-codes",
      fields: [
        { key: "code", label: "Code", type: "text", required: true },
        STATUS,
      ],
    },
  ],
};

export default function AreaLogistic() {
  return <CrudTab config={config} />;
}
