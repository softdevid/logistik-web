import React, { useState } from "react";
import { columns, SORTABLE_COLUMNS } from "../constants/columns";
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency, formatDate } from "../utils/formatter";

function TableHeader({ sortKey, sortDir, onSort, columns }) {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="border-b border-slate-200 bg-slate-50/95 backdrop-blur-sm">
        {columns.map((column) => {
          const sortable = Object.prototype.hasOwnProperty.call(
            SORTABLE_COLUMNS,
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
                    sortDir === "asc" ? (
                      <ChevronUpDownIcon className="h-4 w-4 rotate-180" />
                    ) : (
                      <ChevronUpDownIcon className="h-4 w-4" />
                    )
                  ) : (
                    <ChevronUpDownIcon className="h-4 w-4 text-slate-300" />
                  ))}
              </button>
            </th>
          );
        })}
        <th className="whitespace-nowrap px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
          Action
        </th>
      </tr>
    </thead>
  );
}

function RowMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex justify-center">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        aria-label="Action menu"
      >
        <ChevronDownIcon className="h-5 w-5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-40 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
          >
            <PencilSquareIcon className="h-4 w-4" />
            Edit
          </button>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50"
          >
            <TrashIcon className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) {
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

const BookingTable = ({
  sortKey,
  sortDir,
  handleSort,
  loading,
  visibleRows,
  openEdit,
  handleDelete,
  page,
  totalPages,
  filteredRows,
  pageSize,
  setPage,
  setPageSize
}) => {
  return (
    <div className="mt-4 rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-hidden rounded-3xl">
        <div className="max-h-[68vh] overflow-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <TableHeader
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
              columns={columns}
            />
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan={13}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : visibleRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={13}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    Tidak ada data outbound.
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-500">
                      {row.id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                      {row.awbNo}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {formatDate(row.date)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.doNo}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.destination}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.sender}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.receiver}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.koli}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.kilo}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {row.volume}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {formatCurrency(row.biaya)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
                          row.status === "Delivered"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                            : row.status === "In Transit"
                              ? "bg-sky-50 text-sky-700 ring-sky-200"
                              : row.status === "Cancelled"
                                ? "bg-rose-50 text-rose-700 ring-rose-200"
                                : "bg-amber-50 text-amber-700 ring-amber-200"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-center">
                      <RowMenu
                        onEdit={() => openEdit(row)}
                        onDelete={() => handleDelete(row)}
                      />
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
};

export default BookingTable;
