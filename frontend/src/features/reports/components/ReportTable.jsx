import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import Pagination from "./Pagination";
import Badge from "./Badge";
import {
  formatReportCurrency,
  formatReportDate,
  formatReportNumber,
  formatReportPercent,
} from "../utils/formatters";

function TableHeader({ columns, sortKey, sortDir, onSort }) {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="border-b border-slate-200 bg-slate-50/95 backdrop-blur-sm">
        {columns.map((column) => {
          const sortable = Boolean(column.sortable);
          const active = sortKey === column.key;
          const numeric = ["number", "currency", "percent"].includes(column.type);

          return (
            <th
              key={column.key}
              className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${numeric ? "text-right" : "text-left"}`}
            >
              <button
                type="button"
                onClick={() => sortable && onSort(column.key)}
                disabled={!sortable}
                className={`inline-flex items-center gap-1 ${numeric ? "flex-row-reverse" : ""} ${sortable ? "hover:text-slate-700" : "cursor-default"}`}
              >
                {column.label}
                {sortable && (
                  <ChevronUpDownIcon
                    className={`h-4 w-4 ${active ? "" : "text-slate-300"} ${active && sortDir === "asc" ? "rotate-180" : ""}`}
                  />
                )}
              </button>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

function cellClass(column) {
  const base = "whitespace-nowrap px-4 py-3 text-slate-700";
  if (["number", "currency", "percent"].includes(column.type)) {
    return `${base} text-right`;
  }
  return base;
}

function formatCellValue(row, column, statusMeta) {
  const value = row[column.key];

  if (column.type === "date") return formatReportDate(value);
  if (column.type === "currency") return formatReportCurrency(value);
  if (column.type === "number") return formatReportNumber(value);
  if (column.type === "percent") return formatReportPercent(value);
  if (column.type === "status") {
    return <Badge value={value} meta={statusMeta} />;
  }

  return value ?? "-";
}

export default function ReportTable({
  columns,
  loading,
  visibleRows,
  filteredRows,
  sortKey,
  sortDir,
  handleSort,
  statusMeta,
  page,
  totalPages,
  pageSize,
  setPage,
  setPageSize,
}) {
  return (
    <div className="rounded-b-3xl bg-white shadow-sm">
      <div className="overflow-hidden rounded-b-3xl">
        <div className="max-h-[68vh] overflow-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <TableHeader
              columns={columns}
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            />
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : visibleRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-slate-50/70">
                    {columns.map((column) => (
                      <td key={column.key} className={cellClass(column)}>
                        {formatCellValue(row, column, statusMeta)}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={filteredRows.length}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(nextSize) => {
            setPageSize(nextSize);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
