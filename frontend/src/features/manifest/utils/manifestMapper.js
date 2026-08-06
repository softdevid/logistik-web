import { MANIFEST_DEFAULT_STATUS } from "../constants";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

function toText(value, fallback = "-") {
  const text = String(value ?? "").trim();
  return text === "" ? fallback : text;
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toDateValue(value) {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const date = new Date(`${text}T00:00:00`);
  return Number.isNaN(date.getTime()) ? text : text;
}

export function formatManifestDate(value) {
  if (!value) return "-";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return String(value);
  return dateFormatter.format(date);
}

export function formatManifestCurrency(value) {
  return currencyFormatter.format(toNumber(value));
}

export function compareManifestValues(a, b, type) {
  if (type === "number") {
    return toNumber(a) - toNumber(b);
  }

  if (type === "date") {
    const left = new Date(`${a || ""}T00:00:00`).getTime();
    const right = new Date(`${b || ""}T00:00:00`).getTime();
    return left - right;
  }

  return String(a || "").localeCompare(String(b || ""), "id", {
    numeric: true,
    sensitivity: "base",
  });
}

export function extractManifestList(body) {
  if (Array.isArray(body)) return body;
  if (body && Array.isArray(body.data)) return body.data;
  return [];
}

export function normalizeManifestRow(row = {}) {
  const driver = toText(row.driver ?? row.driverName ?? row.supir, "-");
  const nopol = toText(row.nopol ?? row.vehicleNo ?? row.vehicle, "-");
  const kendaraan = toText(row.kendaraan ?? `${driver} / ${nopol}`, "-");

  return {
    id: toNumber(row.id),
    manifestNo: toText(row.manifestNo ?? row.manifest_no ?? row.no_manifest, "-"),
    date: toDateValue(row.date ?? row.tanggal),
    transit1: toText(row.transit1),
    transit2: toText(row.transit2),
    transit3: toText(row.transit3),
    transit4: toText(row.transit4),
    transit5: toText(row.transit5),
    tujuan: toText(row.tujuan ?? row.destination),
    status: toText(row.status, MANIFEST_DEFAULT_STATUS),
    totAwb: toNumber(row.totAwb ?? row.totalAwb),
    totKoli: toNumber(row.totKoli ?? row.totalKoli),
    totKg: toNumber(row.totKg ?? row.totalKg),
    totVolume: toNumber(row.totVolume ?? row.totalVolume),
    totBiaya: toNumber(row.totBiaya ?? row.totalBiaya),
    driver,
    nopol,
    kendaraan,
  };
}

export function buildManifestPayload(form, existing = {}) {
  const driver = toText(form.driver, "-");
  const nopol = toText(form.nopol, "-");

  return normalizeManifestRow({
    ...existing,
    manifestNo: form.manifestNo,
    date: form.date,
    driver,
    nopol,
    status: form.status,
    kendaraan: `${driver} / ${nopol}`,
  });
}

export function createManifestFormFromRow(row = {}) {
  return {
    manifestNo: row.manifestNo ?? "",
    date: row.date ?? "",
    driver: row.driver ?? "",
    nopol: row.nopol ?? "",
    status: row.status ?? MANIFEST_DEFAULT_STATUS,
  };
}

export function getNextManifestId(rows) {
  return Math.max(...rows.map((row) => toNumber(row.id)), 0) + 1;
}
