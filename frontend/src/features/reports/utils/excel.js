import * as XLSX from "xlsx";
import { formatReportDate } from "./formatters";

function exportValue(value, type, statusMeta) {
  if (type === "date") return formatReportDate(value);
  if (type === "status" && statusMeta) {
    return statusMeta[value]?.label ?? value;
  }
  return value;
}

export function downloadReport(
  rows,
  columns,
  fileName,
  sheetName = "Laporan",
  statusMeta,
  headerLines,
) {
  const workbook = XLSX.utils.book_new();
  const aoa = [];
  if (headerLines?.length) {
    headerLines.forEach((line) => aoa.push([line]));
    aoa.push([]);
  }
  aoa.push(columns.map((column) => column.label));
  rows.forEach((row) => {
    aoa.push(columns.map((column) => exportValue(row[column.key], column.type, statusMeta)));
  });
  const worksheet = XLSX.utils.aoa_to_sheet(aoa);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
