import { ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { MANIFEST_COLUMNS, MANIFEST_SORTABLE_KEYS, MANIFEST_STATUS_META } from "../constants";
import { formatManifestCurrency, formatManifestDate } from "../utils";

function TableHeader({ sortKey, sortDir, onSort }) {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="border-b border-slate-200 bg-slate-50/95 backdrop-blur-sm">
        {MANIFEST_COLUMNS.map((column) => {
          const sortable = Object.prototype.hasOwnProperty.call(
            MANIFEST_SORTABLE_KEYS,
            column.key,
          );
          const active = sortKey === column.key;

          return (
            <th
              key={column.key}
              className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"
            >
              <button
                type="button"
                onClick={() => sortable && onSort(column.key)}
                className={`inline-flex items-center gap-1 ${sortable ? "hover:text-slate-700" : "cursor-default"}`}
                disabled={!sortable}
              >
                {column.label}
                {sortable &&
                  (active ? (
                    <ChevronUpDownIcon
                      className={`h-4 w-4 ${sortDir === "asc" ? "rotate-180" : ""}`}
                    />
                  ) : (
                    <ChevronUpDownIcon className="h-4 w-4 text-slate-300" />
                  ))}
              </button>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

function Pagination({ page, totalPages, totalItems, pageSize, onPageChange, onPageSizeChange }) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="text-sm text-slate-500">
        Menampilkan {start}-{end} dari {totalItems} data
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#0F5C4C]"
        >
          {[10, 20, 50].map((size) => (
            <option key={size} value={size}>
              {size} / halaman
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>
        <div className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700">
          {page} / {Math.max(totalPages, 1)}
        </div>
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || totalPages === 0}
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default function ManifestTable({
  loading,
  visibleRows,
  sortKey,
  sortDir,
  handleSort,
  page,
  totalPages,
  filteredRows,
  pageSize,
  setPage,
  setPageSize,
}) {
  return (
    <div className="rounded-b-3xl bg-white shadow-sm">
      <div className="overflow-hidden rounded-b-3xl">
        <div className="max-h-[68vh] overflow-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <TableHeader sortKey={sortKey} sortDir={sortDir} onSort={handleSort} />
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={MANIFEST_COLUMNS.length}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : visibleRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={MANIFEST_COLUMNS.length}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    Tidak ada data manifest.
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => (
                  <tr key={row.id} className="transition-colors hover:bg-slate-50/70">
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                      {row.manifestNo}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {formatManifestDate(row.date)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.transit1}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.transit2}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.transit3}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.transit4}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.transit5}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.tujuan}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${MANIFEST_STATUS_META[row.status]?.className || "bg-slate-100 text-slate-600 ring-slate-200"}`}
                      >
                        {MANIFEST_STATUS_META[row.status]?.label || row.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-slate-700">
                      {row.totAwb}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-slate-700">
                      {row.totKoli}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-slate-700">
                      {row.totKg}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-slate-700">
                      {row.totVolume}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-900">
                      {formatManifestCurrency(row.totBiaya)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.kendaraan}
                    </td>
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
          onPageChange={(nextPage) => setPage(nextPage)}
          onPageSizeChange={(nextSize) => {
            setPageSize(nextSize);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
