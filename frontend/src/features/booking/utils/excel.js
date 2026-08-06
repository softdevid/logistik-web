import * as XLSX from "xlsx";

export function downloadWorkbook(rows, fileName, sheetName) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows);
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

export function downloadFailedRows(failedRows) {
  downloadWorkbook(
    failedRows.map((row) => ({ Row: row.row, Reason: row.reason })),
    "failed-rows-on-site-outbound.xlsx",
    "Failed Rows",
  );
}