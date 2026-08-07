import { useMemo, useState } from "react";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import Badge from "@/features/reports/components/Badge";
import { downloadReport } from "@/features/reports/utils/excel";
import { seedCustomerShipments, seedCustomerTransactions } from "@/features/reports/data/seed";

const TABS = [
  { id: "pengiriman", label: "Pengiriman" },
  { id: "pod", label: "POD Kembali" },
  { id: "status", label: "Semua Status" },
  { id: "transaksi", label: "Report Customer" },
];

const SHIP_STATUS_META = {
  Delivered: { label: "Delivered", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  Undelivered: { label: "Undelivered", className: "bg-rose-50 text-rose-700 ring-rose-200" },
};

const AWB_STATUS_META = {
  "ON PROGRESS": { label: "ON PROGRESS", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  RECEIVED: { label: "RECEIVED", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
};

const TAB1_COLUMNS = [
  { key: "no", label: "No.", align: "center" },
  { key: "awbNo", label: "AWB No." },
  { key: "date", label: "AWB Date", type: "slash" },
  { key: "moda", label: "Moda" },
  { key: "service", label: "Service" },
  { key: "origin", label: "Origin" },
  { key: "destination", label: "Destination" },
  { key: "customer", label: "Customer" },
  { key: "consignee", label: "Consignee" },
  { key: "reffNo", label: "Reff No" },
  { key: "shipperInstruction", label: "Shipper Instruction" },
  { key: "weight", label: "Weight", type: "number", align: "right" },
  { key: "collie", label: "Collie", type: "number", align: "right" },
  { key: "status", label: "Shipment Status", type: "status" },
  { key: "receivedBy", label: "Received By" },
  { key: "receivedDate", label: "Received Date", type: "slash" },
  { key: "leadtime", label: "Leadtime", type: "number", align: "right" },
];

const TAB2_COLUMNS = [
  { key: "no", label: "No.", align: "center" },
  { key: "awbNo", label: "AWB" },
  { key: "date", label: "AWB Date", type: "slash" },
  { key: "destination", label: "Destination" },
  { key: "consignee", label: "Consignee" },
  { key: "reffNo", label: "Reff No" },
  { key: "receivedBy", label: "Received By" },
  { key: "podReceivedDate", label: "Received Date", type: "slash" },
  { key: "statusAWB", label: "Status AWB", type: "badge" },
  { key: "remarks", label: "Remarks" },
];

const TAB3_COLUMNS = [
  { key: "awbNo", label: "AWB" },
  { key: "date", label: "Date", type: "dmy" },
  { key: "moda", label: "Moda" },
  { key: "service", label: "Service" },
  { key: "origin", label: "Origin" },
  { key: "destination", label: "Destination" },
  { key: "customer", label: "Shipper" },
  { key: "consignee", label: "Consignee" },
  { key: "collie", label: "Koli", type: "number", align: "right" },
  { key: "weight", label: "Kilo", type: "number", align: "right" },
  { key: "shipperInstruction", label: "Description" },
  { key: "statusName", label: "Shipment Status", type: "badge" },
  { key: "receivedBy", label: "Received by" },
  { key: "noManifest", label: "No Manifest" },
];

const TAB3_EXPORT_COLUMNS = [
  { key: "no", label: "No." },
  { key: "awbNo", label: "AWB" },
  { key: "awbDate", label: "AWB Date" },
  { key: "reffNo", label: "Reff No" },
  { key: "originCode", label: "Origin" },
  { key: "origin", label: "Origin Name" },
  { key: "destinationCode", label: "Destination" },
  { key: "destination", label: "Destination Name" },
  { key: "customer", label: "Customer Name" },
  { key: "consignee", label: "Consignee Name" },
  { key: "consigneeAddress", label: "Consignee Address" },
  { key: "moda", label: "Moda" },
  { key: "service", label: "Service" },
  { key: "weight", label: "Weight" },
  { key: "uom", label: "UOM" },
  { key: "collie", label: "Colly" },
  { key: "totalBiaya", label: "Totbi" },
  { key: "statusName", label: "Status Name" },
  { key: "remarks", label: "Remarks" },
  { key: "statusReceivedBy", label: "Status Received By" },
  { key: "statusReceivedDate", label: "Status Received Date" },
  { key: "statusReceivedTime", label: "Status Received Time" },
  { key: "leadTime", label: "Lead Time" },
  { key: "podReturnDate", label: "POD Return Date" },
  { key: "shipperInstruction", label: "Shipper Instruction" },
];

const filterClass =
  "rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-[#0F5C4C] focus:ring-2 focus:ring-[#0F5C4C]/20";

const TAB4_GROUPS = [
  {
    label: "Detail Resi",
    cols: [
      { key: "no", label: "No.", align: "center" },
      { key: "tanggal", label: "Tanggal" },
      { key: "noResi", label: "No. Resi" },
      { key: "nomorDO", label: "Nomor DO" },
      { key: "customer", label: "Customer" },
      { key: "asal", label: "Asal" },
      { key: "asalDetail", label: "Asal Detail" },
      { key: "tujuan", label: "Tujuan" },
      { key: "tujuanDetail", label: "Tujuan Detail" },
      { key: "pelanggan", label: "Pelanggan" },
      { key: "layanan", label: "Layanan" },
      { key: "tipeDp", label: "Tipe D/P" },
      { key: "moda", label: "Moda" },
    ],
  },
  {
    label: "Pengirim",
    cols: [
      { key: "pengirimNama", label: "Nama" },
      { key: "pengirimAlamat", label: "Alamat" },
      { key: "pengirimKota", label: "Kota" },
      { key: "pengirimKodePos", label: "Kode Pos" },
      { key: "pengirimTelepon", label: "No. Telepon" },
      { key: "pengirimProvinsi", label: "Provinsi" },
      { key: "pengirimNegara", label: "Negara" },
    ],
  },
  {
    label: "Penerima Barang",
    cols: [
      { key: "penerimaNama", label: "Nama" },
      { key: "penerimaAlamat", label: "Alamat" },
      { key: "penerimaKota", label: "Kota" },
      { key: "penerimaKodePos", label: "Kode Pos" },
      { key: "penerimaTelepon", label: "No. Telepon" },
      { key: "penerimaProvinsi", label: "Provinsi" },
      { key: "penerimaNegara", label: "Negara" },
    ],
  },
  {
    label: "Jenis Tagihan",
    cols: [
      { key: "barang", label: "Barang" },
      { key: "koli", label: "Koli", type: "number", align: "right" },
      { key: "berat", label: "Berat", type: "number", align: "right" },
      { key: "volume", label: "Volume", type: "number", align: "right" },
      { key: "hargaKg", label: "Harga/Kg", type: "number", align: "right" },
      { key: "biayaLain", label: "Biaya Lain", type: "number", align: "right" },
      { key: "diskon", label: "Diskon", type: "number", align: "right" },
      { key: "biayaKirim", label: "Biaya Pengiriman", type: "number", align: "right" },
      { key: "ppnPersen", label: "PPN %", type: "number", align: "right" },
      { key: "ppn", label: "PPN", type: "number", align: "right" },
      { key: "biayaAsuransi", label: "Biaya Asuransi", type: "number", align: "right" },
      { key: "biayaPacking", label: "Biaya Packing", type: "number", align: "right" },
      { key: "biayaPickup", label: "Biaya Pickup", type: "number", align: "right" },
      { key: "grandTotal", label: "Grand Total", type: "number", align: "right" },
      { key: "cash", label: "CASH" },
      { key: "trf", label: "TRF" },
      { key: "kredit", label: "KREDIT" },
      { key: "cod", label: "COD" },
      { key: "feeCod", label: "Fee COD", type: "number", align: "right" },
      { key: "noManifest", label: "No Manifest Pemberangkatan" },
      { key: "noKendaraan", label: "No Kendaraan" },
      { key: "driver", label: "Driver" },
      { key: "tanggalManifest", label: "Tanggal Manifest Pemberangkatan" },
      { key: "tanggalGudangTujuan", label: "Tanggal Gudang Tujuan" },
      { key: "noDrs", label: "No DRS" },
      { key: "noKendaraanDrs", label: "No Kendaraan" },
      { key: "driverDrs", label: "Driver" },
      { key: "tanggalDrs", label: "Tanggal DRS" },
      { key: "tanggalTerima", label: "Tanggal Terima" },
      { key: "namaPenerima", label: "Nama Penerima" },
      { key: "keterangan", label: "Keterangan" },
      { key: "status", label: "Status" },
      { key: "invoiceNo", label: "Invoice No." },
      { key: "jumlahPembayaran", label: "Jumlah Pembayaran" },
      { key: "namaBank", label: "Nama Bank" },
      { key: "closedDate", label: "Closed Date" },
    ],
  },
];

const TAB4_FLAT_COLUMNS = TAB4_GROUPS.flatMap((group) => group.cols);

function cell(value) {
  if (value === null || value === undefined || value === "") return "-";
  return value;
}

function formatSlashDate(value) {
  if (!value) return "-";
  const [y, m, d] = value.split("-");
  return `${d}/${m}/${y.slice(2)}`;
}

function formatDMY(value) {
  if (!value) return "-";
  const [y, m, d] = value.split("-");
  return `${Number(d)}/${Number(m)}/${y}`;
}

function dateRangeRows(rows, dateFrom, dateTo) {
  const from = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : -Infinity;
  const to = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : Infinity;
  return rows.filter((row) => {
    const time = new Date(`${row.date}T00:00:00`).getTime();
    return !Number.isNaN(time) && time >= from && time <= to;
  });
}

function FilterDate({ label, value, onChange }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={filterClass}
      />
    </label>
  );
}

function FilterSelect({ label, value, onChange, allLabel, options }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className={filterClass}>
        <option value="all">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function SummaryCard({ label, value, unit }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm">
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="text-xl font-bold tabular-nums text-slate-900">
        {value}
        {unit && <span className="ml-1 text-sm font-semibold text-slate-500">{unit}</span>}
      </p>
    </div>
  );
}

function ReportHeader({ title, dateFrom, dateTo, customer }) {
  return (
    <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
      <p className="text-center text-base font-bold uppercase tracking-wide text-slate-900">
        {title}
      </p>
      <div className="mt-3 flex flex-col gap-1 text-sm text-slate-700">
        <p>
          Start Date : <span className="font-medium">{dateFrom || "-"}</span>
        </p>
        <p>
          End Date&nbsp;&nbsp; : <span className="font-medium">{dateTo || "-"}</span>
        </p>
        <p>
          Customer : <span className="font-medium">{customer}</span>
        </p>
      </div>
    </div>
  );
}

function PengirimanTab() {
  const [dateFrom, setDateFrom] = useState("2026-08-07");
  const [dateTo, setDateTo] = useState("2026-08-07");
  const [customer, setCustomer] = useState("all");
  const [destination, setDestination] = useState("all");

  const customerOptions = useMemo(
    () => [...new Set(seedCustomerShipments.map((row) => row.customer))].sort(),
    [],
  );
  const destinationOptions = useMemo(
    () => [...new Set(seedCustomerShipments.map((row) => row.destination))].sort(),
    [],
  );

  const rows = useMemo(
    () =>
      dateRangeRows(seedCustomerShipments, dateFrom, dateTo)
        .filter((row) => customer === "all" || row.customer === customer)
        .filter((row) => destination === "all" || row.destination === destination),
    [dateFrom, dateTo, customer, destination],
  );

  function handleExport() {
    const exportRows = rows.map((row, index) => ({
      no: index + 1,
      awbNo: row.awbNo,
      awbDate: formatSlashDate(row.date),
      moda: row.moda,
      service: row.service,
      origin: row.origin,
      destination: row.destination,
      customer: row.customer,
      consignee: cell(row.consignee),
      reffNo: cell(row.reffNo),
      shipperInstruction: cell(row.shipperInstruction),
      weight: row.weight,
      collie: row.collie,
      status: SHIP_STATUS_META[row.status]?.label ?? cell(row.status),
      receivedBy: cell(row.receivedBy),
      receivedDate: formatSlashDate(row.receivedDate),
      leadtime: row.leadtime,
    }));
    const exportColumns = [
      { key: "no", label: "No." },
      { key: "awbNo", label: "AWB No." },
      { key: "awbDate", label: "AWB Date" },
      { key: "moda", label: "Moda" },
      { key: "service", label: "Service" },
      { key: "origin", label: "Origin" },
      { key: "destination", label: "Destination" },
      { key: "customer", label: "Customer" },
      { key: "consignee", label: "Consignee" },
      { key: "reffNo", label: "Reff No" },
      { key: "shipperInstruction", label: "Shipper Instruction" },
      { key: "weight", label: "Weight" },
      { key: "collie", label: "Collie" },
      { key: "status", label: "Shipment Status" },
      { key: "receivedBy", label: "Received By" },
      { key: "receivedDate", label: "Received Date" },
      { key: "leadtime", label: "Leadtime" },
    ];
    downloadReport(exportRows, exportColumns, "laporan-customer-pengiriman.xlsx", "Detail Pengiriman");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <FilterDate label="Start Date" value={dateFrom} onChange={setDateFrom} />
            <FilterDate label="End Date" value={dateTo} onChange={setDateTo} />
            <FilterSelect
              label="Customer"
              value={customer}
              onChange={setCustomer}
              allLabel="All Customer"
              options={customerOptions}
            />
            <FilterSelect
              label="Destination"
              value={destination}
              onChange={setDestination}
              allLabel="All Destination"
              options={destinationOptions}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDateFrom("2026-08-07");
                setDateTo("2026-08-07");
                setCustomer("all");
                setDestination("all");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5C4C] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0C4A3D]"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <ReportHeader
          title="Detail Pengiriman"
          dateFrom={dateFrom}
          dateTo={dateTo}
          customer={customer === "all" ? "All Customer" : customer}
        />

        <div className="overflow-x-auto">
          <div className="max-h-[60vh] overflow-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-slate-200 bg-slate-50/95 backdrop-blur-sm">
                  {TAB1_COLUMNS.map((column) => (
                    <th
                      key={column.key}
                      className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                        column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left"
                      }`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {rows.map((row, index) => (
                  <tr key={row.id} className="transition-colors hover:bg-slate-50">
                    {TAB1_COLUMNS.map((column) => {
                      if (column.key === "no") {
                        return (
                          <td key={column.key} className="whitespace-nowrap px-4 py-2.5 text-center text-slate-700">
                            {index + 1}
                          </td>
                        );
                      }
                      const value = row[column.key];
                      let content;
                      if (column.type === "slash") content = formatSlashDate(value);
                      else if (column.type === "status") content = <Badge value={value} meta={SHIP_STATUS_META} />;
                      else content = cell(value);
                      return (
                        <td
                          key={column.key}
                          className={`whitespace-nowrap px-4 py-2.5 ${
                            column.align === "right" ? "text-right tabular-nums" : "text-left"
                          } ${content === "-" ? "text-slate-400" : "text-slate-700"}`}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={TAB1_COLUMNS.length} className="px-4 py-10 text-center text-sm text-slate-400">
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function PodKembaliTab() {
  const [dateFrom, setDateFrom] = useState("2026-08-07");
  const [dateTo, setDateTo] = useState("2026-08-07");
  const [asal, setAsal] = useState("all");
  const [tujuan, setTujuan] = useState("all");
  const [customer, setCustomer] = useState("all");

  const asalOptions = useMemo(
    () => [...new Set(seedCustomerShipments.map((row) => row.origin))].filter(Boolean).sort(),
    [],
  );
  const tujuanOptions = useMemo(
    () => [...new Set(seedCustomerShipments.map((row) => row.destination))].sort(),
    [],
  );
  const customerOptions = useMemo(
    () => [...new Set(seedCustomerShipments.map((row) => row.customer))].sort(),
    [],
  );

  const rows = useMemo(
    () =>
      dateRangeRows(seedCustomerShipments, dateFrom, dateTo)
        .filter((row) => asal === "all" || row.origin === asal)
        .filter((row) => tujuan === "all" || row.destination === tujuan)
        .filter((row) => customer === "all" || row.customer === customer),
    [dateFrom, dateTo, asal, tujuan, customer],
  );

  function handleExport() {
    const exportRows = rows.map((row, index) => ({
      no: index + 1,
      awb: row.awbNo,
      awbDate: formatSlashDate(row.date),
      destination: row.destination,
      consignee: cell(row.consignee),
      reffNo: cell(row.reffNo),
      receivedBy: cell(row.receivedBy),
      receivedDate: formatSlashDate(row.podReceivedDate),
      statusAWB: row.statusAWB,
      remarks: cell(row.remarks),
    }));
    const exportColumns = [
      { key: "no", label: "No." },
      { key: "awb", label: "AWB" },
      { key: "awbDate", label: "AWB Date" },
      { key: "destination", label: "Destination" },
      { key: "consignee", label: "Consignee" },
      { key: "reffNo", label: "Reff No" },
      { key: "receivedBy", label: "Received By" },
      { key: "receivedDate", label: "Received Date" },
      { key: "statusAWB", label: "Status AWB" },
      { key: "remarks", label: "Remarks" },
    ];
    downloadReport(exportRows, exportColumns, "laporan-customer-pod-kembali.xlsx", "POD Return");
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <FilterDate label="Start Date" value={dateFrom} onChange={setDateFrom} />
            <FilterDate label="End Date" value={dateTo} onChange={setDateTo} />
            <FilterSelect label="Asal" value={asal} onChange={setAsal} allLabel="Semua Asal" options={asalOptions} />
            <FilterSelect label="Tujuan" value={tujuan} onChange={setTujuan} allLabel="Semua Tujuan" options={tujuanOptions} />
            <FilterSelect label="Customer" value={customer} onChange={setCustomer} allLabel="All Customer" options={customerOptions} />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDateFrom("2026-08-07");
                setDateTo("2026-08-07");
                setAsal("all");
                setTujuan("all");
                setCustomer("all");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5C4C] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0C4A3D]"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <ReportHeader
          title="POD Return"
          dateFrom={dateFrom}
          dateTo={dateTo}
          customer={customer === "all" ? "All Customer" : customer}
        />

        <div className="overflow-x-auto">
          <div className="max-h-[60vh] overflow-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-slate-200 bg-slate-50/95 backdrop-blur-sm">
                  {TAB2_COLUMNS.map((column) => (
                    <th
                      key={column.key}
                      className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                        column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left"
                      }`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {rows.map((row, index) => (
                  <tr key={row.id} className="transition-colors hover:bg-slate-50">
                    {TAB2_COLUMNS.map((column) => {
                      if (column.key === "no") {
                        return (
                          <td key={column.key} className="whitespace-nowrap px-4 py-2.5 text-center text-slate-700">
                            {index + 1}
                          </td>
                        );
                      }
                      const value = row[column.key];
                      let content;
                      if (column.type === "slash") content = formatSlashDate(value);
                      else if (column.type === "badge") content = <Badge value={value} meta={AWB_STATUS_META} />;
                      else content = cell(value);
                      return (
                        <td
                          key={column.key}
                          className={`whitespace-nowrap px-4 py-2.5 ${
                            column.align === "right" ? "text-right tabular-nums" : "text-left"
                          } ${content === "-" ? "text-slate-400" : "text-slate-700"}`}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={TAB2_COLUMNS.length} className="px-4 py-10 text-center text-sm text-slate-400">
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function SemuaStatusTab() {
  const [dateFrom, setDateFrom] = useState("2026-08-07");
  const [dateTo, setDateTo] = useState("2026-08-07");
  const [asal, setAsal] = useState("all");
  const [tujuan, setTujuan] = useState("all");
  const [customer, setCustomer] = useState("all");
  const [billing, setBilling] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [showCount, setShowCount] = useState(10);
  const [page, setPage] = useState(1);

  const asalOptions = useMemo(
    () => [...new Set(seedCustomerShipments.map((row) => row.origin))].filter(Boolean).sort(),
    [],
  );
  const tujuanOptions = useMemo(
    () => [...new Set(seedCustomerShipments.map((row) => row.destination))].sort(),
    [],
  );
  const customerOptions = useMemo(
    () => [...new Set(seedCustomerShipments.map((row) => row.customer))].sort(),
    [],
  );
  const billingOptions = useMemo(
    () => [...new Set(seedCustomerShipments.map((row) => row.billing))].sort(),
    [],
  );
  const statusOptions = useMemo(
    () => [...new Set(seedCustomerShipments.map((row) => row.statusName))].sort(),
    [],
  );

  const filtered = useMemo(
    () =>
      dateRangeRows(seedCustomerShipments, dateFrom, dateTo)
        .filter((row) => asal === "all" || row.origin === asal)
        .filter((row) => tujuan === "all" || row.destination === tujuan)
        .filter((row) => customer === "all" || row.customer === customer)
        .filter((row) => billing === "all" || row.billing === billing)
        .filter((row) => status === "all" || row.statusName === status),
    [dateFrom, dateTo, asal, tujuan, customer, billing, status],
  );

  const rows = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return filtered;
    return filtered.filter((row) =>
      [row.awbNo, row.customer, row.consignee, row.destination, row.origin, row.statusName]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [filtered, search]);

  const summary = useMemo(
    () => ({
      pod: rows.length,
      kilo: rows.reduce((sum, row) => sum + Number(row.weight), 0),
      koli: rows.reduce((sum, row) => sum + Number(row.collie), 0),
    }),
    [rows],
  );

  const totalPages = Math.max(1, Math.ceil(rows.length / showCount));
  const safePage = Math.min(page, totalPages);
  const pagedRows = useMemo(
    () => rows.slice((safePage - 1) * showCount, safePage * showCount),
    [rows, safePage, showCount],
  );

  function handleExport() {
    const totKilo = rows.reduce((sum, row) => sum + Number(row.weight), 0);
    const totKoli = rows.reduce((sum, row) => sum + Number(row.collie), 0);
    const totBiaya = rows.reduce((sum, row) => sum + Number(row.totalBiaya), 0);

    const exportRows = rows.map((row, index) => ({
      no: index + 1,
      awbNo: row.awbNo,
      awbDate: formatDMY(row.date),
      reffNo: cell(row.reffNo),
      originCode: row.originCode,
      origin: row.origin,
      destinationCode: row.destinationCode,
      destination: row.destination,
      customer: row.customer,
      consignee: cell(row.consignee),
      consigneeAddress: cell(row.consigneeAddress),
      moda: row.moda,
      service: row.service,
      weight: row.weight,
      uom: row.uom,
      collie: row.collie,
      totalBiaya: row.totalBiaya,
      statusName: row.statusName,
      remarks: cell(row.remarks),
      statusReceivedBy: cell(row.statusReceivedBy),
      statusReceivedDate: row.statusReceivedDate ? formatDMY(row.statusReceivedDate) : "",
      statusReceivedTime: cell(row.statusReceivedTime),
      leadTime: row.leadtime !== 0 ? row.leadtime : "",
      podReturnDate: cell(row.podReturnDate),
      shipperInstruction: cell(row.shipperInstruction),
    }));
    exportRows.push({
      no: "SUB TOTAL",
      weight: totKilo,
      uom: "KG",
      collie: totKoli,
      totalBiaya: totBiaya,
    });

    const headerLines = [
      "Report All Status",
      `Start Date : ${dateFrom || "-"}`,
      `End Date   : ${dateTo || "-"}`,
      `Customer : ${customer === "all" ? "All Customer" : customer}`,
    ];
    downloadReport(
      exportRows,
      TAB3_EXPORT_COLUMNS,
      "laporan-customer-semua-status.xlsx",
      "Report All Status",
      undefined,
      headerLines,
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <FilterDate label="Periode Dari" value={dateFrom} onChange={setDateFrom} />
            <FilterDate label="Periode Sampai" value={dateTo} onChange={setDateTo} />
            <FilterSelect label="Asal" value={asal} onChange={setAsal} allLabel="Semua Asal" options={asalOptions} />
            <FilterSelect label="Tujuan" value={tujuan} onChange={setTujuan} allLabel="Semua Tujuan" options={tujuanOptions} />
            <FilterSelect label="Customer" value={customer} onChange={setCustomer} allLabel="All Customer" options={customerOptions} />
            <FilterSelect label="Billing" value={billing} onChange={setBilling} allLabel="Semua Billing" options={billingOptions} />
            <FilterSelect label="Status Kiriman" value={status} onChange={setStatus} allLabel="Semua Status" options={statusOptions} />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDateFrom("2026-08-07");
                setDateTo("2026-08-07");
                setAsal("all");
                setTujuan("all");
                setCustomer("all");
                setBilling("all");
                setStatus("all");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5C4C] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0C4A3D]"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Total POD" value={summary.pod} unit="AWB" />
        <SummaryCard label="Total Kilo" value={summary.kilo} unit="Kg" />
        <SummaryCard label="Total Koli" value={summary.koli} unit="Pieces" />
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Show
            <select
              value={showCount}
              onChange={(e) => {
                setShowCount(Number(e.target.value));
                setPage(1);
              }}
              className={filterClass}
            >
              {[10, 25, 50].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>
            entries
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            Search:
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Cari AWB / customer..."
              className={filterClass}
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <div className="max-h-[60vh] overflow-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-slate-200 bg-slate-50/95 backdrop-blur-sm">
                  {TAB3_COLUMNS.map((column) => (
                    <th
                      key={column.key}
                      className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                        column.align === "right" ? "text-right" : "text-left"
                      }`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {pagedRows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-slate-50">
                    {TAB3_COLUMNS.map((column) => {
                      const value = row[column.key];
                      let content;
                      if (column.type === "dmy") content = formatDMY(value);
                      else if (column.type === "badge") content = <Badge value={value} meta={AWB_STATUS_META} />;
                      else content = cell(value);
                      return (
                        <td
                          key={column.key}
                          className={`whitespace-nowrap px-4 py-2.5 ${
                            column.align === "right" ? "text-right tabular-nums" : "text-left"
                          } ${content === "-" ? "text-slate-400" : "text-slate-700"}`}
                        >
                          {content}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {pagedRows.length === 0 && (
                  <tr>
                    <td colSpan={TAB3_COLUMNS.length} className="px-4 py-10 text-center text-sm text-slate-400">
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm text-slate-500">
            Showing {rows.length === 0 ? 0 : (safePage - 1) * showCount + 1} to{" "}
            {Math.min(safePage * showCount, rows.length)} of {rows.length} entries
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Sebelumnya
            </button>
            <span className="text-sm text-slate-600">
              Halaman {safePage} dari {totalPages}
            </span>
            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage(safePage + 1)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TransaksiTab() {
  const [dateFrom, setDateFrom] = useState("2026-08-07");
  const [dateTo, setDateTo] = useState("2026-08-07");
  const [origin, setOrigin] = useState("all");
  const [destination, setDestination] = useState("all");
  const [customer, setCustomer] = useState("all");
  const [billingType, setBillingType] = useState("all");

  const originOptions = useMemo(
    () => [...new Set(seedCustomerTransactions.map((row) => row.asal))].filter(Boolean).sort(),
    [],
  );
  const destinationOptions = useMemo(
    () => [...new Set(seedCustomerTransactions.map((row) => row.tujuan))].filter(Boolean).sort(),
    [],
  );
  const customerOptions = useMemo(
    () => [...new Set(seedCustomerTransactions.map((row) => row.customer))].sort(),
    [],
  );
  const billingTypeOptions = useMemo(
    () => [...new Set(seedCustomerTransactions.map((row) => row.billingType))].filter(Boolean).sort(),
    [],
  );

  const rows = useMemo(
    () =>
      dateRangeRows(seedCustomerTransactions, dateFrom, dateTo)
        .filter((row) => origin === "all" || row.asal === origin)
        .filter((row) => destination === "all" || row.tujuan === destination)
        .filter((row) => customer === "all" || row.customer === customer)
        .filter((row) => billingType === "all" || row.billingType === billingType),
    [dateFrom, dateTo, origin, destination, customer, billingType],
  );

  function handleExport() {
    const exportRows = rows.map((row, index) => {
      const record = { no: index + 1 };
      TAB4_FLAT_COLUMNS.forEach((column) => {
        if (column.key === "no") return;
        record[column.key] = row[column.key];
      });
      return record;
    });
    const headerLines = [
      "Detail Transaksi Customer",
      `Start Date : ${dateFrom || "-"}`,
      `End Date   : ${dateTo || "-"}`,
      `Customer : ${customer === "all" ? "All Customers" : customer}`,
    ];
    downloadReport(
      exportRows,
      TAB4_FLAT_COLUMNS.map((column) => ({ key: column.key, label: column.label })),
      "laporan-customer-detail-transaksi.xlsx",
      "Detail Transaksi Customer",
      undefined,
      headerLines,
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4">
          <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <FilterDate label="Start Date" value={dateFrom} onChange={setDateFrom} />
            <FilterDate label="End Date" value={dateTo} onChange={setDateTo} />
            <FilterSelect label="Origin" value={origin} onChange={setOrigin} allLabel="Semua Origin" options={originOptions} />
            <FilterSelect label="Destination" value={destination} onChange={setDestination} allLabel="Semua Destination" options={destinationOptions} />
            <FilterSelect label="Customer" value={customer} onChange={setCustomer} allLabel="All Customers" options={customerOptions} />
            <FilterSelect label="Billing Type" value={billingType} onChange={setBillingType} allLabel="Semua Billing" options={billingTypeOptions} />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setDateFrom("2026-08-07");
                setDateTo("2026-08-07");
                setOrigin("all");
                setDestination("all");
                setCustomer("all");
                setBillingType("all");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5C4C] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0C4A3D]"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-4 sm:px-6">
          <p className="text-center text-base font-bold uppercase tracking-wide text-slate-900">
            Detail Transaksi Customer
          </p>
          <div className="mt-3 flex flex-col gap-1 text-sm text-slate-700">
            <p>
              Start Date : <span className="font-medium">{dateFrom || "-"}</span>
            </p>
            <p>
              End Date&nbsp;&nbsp; : <span className="font-medium">{dateTo || "-"}</span>
            </p>
            <p>
              Customer :{" "}
              <span className="font-medium">{customer === "all" ? "All Customers" : customer}</span>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="max-h-[60vh] overflow-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-slate-200 bg-slate-100/95 backdrop-blur-sm">
                  {TAB4_GROUPS.map((group) => (
                    <th
                      key={group.label}
                      colSpan={group.cols.length}
                      className="px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-600"
                    >
                      {group.label}
                    </th>
                  ))}
                </tr>
                <tr className="border-b border-slate-200 bg-slate-50/95 backdrop-blur-sm">
                  {TAB4_FLAT_COLUMNS.map((column) => (
                    <th
                      key={column.key}
                      className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                        column.align === "right" ? "text-right" : column.align === "center" ? "text-center" : "text-left"
                      }`}
                    >
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {rows.map((row, index) => (
                  <tr key={row.id} className="transition-colors hover:bg-slate-50">
                    {TAB4_FLAT_COLUMNS.map((column) => {
                      if (column.key === "no") {
                        return (
                          <td key={column.key} className="whitespace-nowrap px-4 py-2.5 text-center text-slate-700">
                            {index + 1}
                          </td>
                        );
                      }
                      const value = row[column.key];
                      const display =
                        value === "" || value === null || value === undefined ? "" : value;
                      return (
                        <td
                          key={column.key}
                          className={`whitespace-nowrap px-4 py-2.5 ${
                            column.align === "right" ? "text-right tabular-nums" : "text-left"
                          } text-slate-700`}
                        >
                          {display}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={TAB4_FLAT_COLUMNS.length} className="px-4 py-10 text-center text-sm text-slate-400">
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerReports() {
  const [activeTab, setActiveTab] = useState("pengiriman");

  return (
    <div className="min-h-full bg-slate-50 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Laporan
          </p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            Customer Reports
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Detail pengiriman, POD return, dan rekap semua status kiriman per customer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#0F5C4C] text-white shadow-sm"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "pengiriman" && <PengirimanTab />}
        {activeTab === "pod" && <PodKembaliTab />}
        {activeTab === "status" && <SemuaStatusTab />}
        {activeTab === "transaksi" && <TransaksiTab />}
      </div>
    </div>
  );
}
