import { Fragment, useMemo, useState } from "react";
import {
  ArrowDownTrayIcon,
  ChevronDownIcon,
  EyeIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import Pagination from "./Pagination";
import Badge from "./Badge";
import {
  formatReportCurrency,
  formatReportDate,
  formatReportNumber,
} from "../utils/formatters";
import { downloadReport } from "../utils/excel";

const NUMERIC_TYPES = new Set(["number", "currency", "percent"]);

function ToolbarInput(props) {
  return (
    <input
      {...props}
      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-[#0F5C4C] focus:bg-white focus:ring-2 focus:ring-[#0F5C4C]/20"
    />
  );
}

function ToolbarSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-[#0F5C4C] focus:bg-white focus:ring-2 focus:ring-[#0F5C4C]/20"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function ToolbarField({ label, children }) {
  return (
    <div className="min-w-0 flex-1">
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}

function formatCell(row, column, statusMeta) {
  const value = row[column.key];

  if (column.type === "date") return formatReportDate(value);
  if (column.type === "currency") return formatReportCurrency(value);
  if (column.type === "number") return formatReportNumber(value);
  if (column.type === "status") return <Badge value={value} meta={statusMeta} />;

  return value ?? "-";
}

export default function ManifesList({
  listTitle = "Daftar Manifes",
  columns = [],
  rows = [],
  filters = [],
  dateFilterField,
  searchFields = [],
  searchPlaceholder = "Cari...",
  statusMeta,
  exportFileName = "daftar-manifes.xlsx",
  detailFields,
}) {
  const [selectValues, setSelectValues] = useState(
    Object.fromEntries(filters.map((filter) => [filter.key, "all"])),
  );
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openId, setOpenId] = useState(null);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();

    return rows
      .filter((row) => {
        const active = Object.entries(selectValues).filter(([, value]) => value && value !== "all");
        return active.every(([key, value]) => String(row[key] ?? "") === value);
      })
      .filter((row) => {
        if (!dateFilterField || (!dateFrom && !dateTo)) return true;
        const from = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : -Infinity;
        const to = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : Infinity;
        const time = new Date(`${String(row[dateFilterField] ?? "")}T00:00:00`).getTime();
        return !Number.isNaN(time) && time >= from && time <= to;
      })
      .filter((row) => {
        if (!query) return true;
        return searchFields.some((field) =>
          String(row[field] ?? "")
            .toLowerCase()
            .includes(query),
        );
      });
  }, [rows, selectValues, search, searchFields, dateFilterField, dateFrom, dateTo]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const activePage = Math.min(page, totalPages);
  const visibleRows = filteredRows.slice((activePage - 1) * pageSize, activePage * pageSize);

  function handleReset() {
    setSelectValues(
      Object.fromEntries(filters.map((filter) => [filter.key, "all"])),
    );
    setSearch("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
    setOpenId(null);
  }

  function handleExport() {
    downloadReport(
      filteredRows,
      columns,
      exportFileName,
      listTitle,
      statusMeta,
    );
  }

  function toggleDetail(id) {
    setOpenId((current) => (current === id ? null : id));
  }

  const tableColumns = [...columns, { key: "aksi", label: "Aksi" }];

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Filters */}
      {filters.length > 0 && (
        <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
          <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
            {filters.map((filter) => (
              <ToolbarField key={filter.key} label={filter.label}>
                <ToolbarSelect
                  value={selectValues[filter.key]}
                  onChange={(value) => {
                    setSelectValues((prev) => ({ ...prev, [filter.key]: value }));
                    setPage(1);
                  }}
                  options={[
                    { value: "all", label: `Semua ${filter.label}` },
                    ...filter.options,
                  ]}
                />
              </ToolbarField>
            ))}
          </div>

          {dateFilterField && (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-600">Tanggal</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-[#0F5C4C] focus:bg-white focus:ring-2 focus:ring-[#0F5C4C]/20"
                />
              </div>
              <span className="hidden text-sm text-slate-400 sm:block">s/d</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-[#0F5C4C] focus:bg-white focus:ring-2 focus:ring-[#0F5C4C]/20"
                />
              </div>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
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
      )}

      {/* List header */}
      <div className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <h3 className="text-lg font-semibold text-slate-900">{listTitle}</h3>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Show entries</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#0F5C4C]"
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="relative sm:w-64">
            <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <ToolbarInput
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder={searchPlaceholder}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <div className="max-h-[60vh] overflow-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-slate-200 bg-slate-50/95 backdrop-blur-sm">
                {tableColumns.map((column) => (
                  <th
                    key={column.key}
                    className={`whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                      NUMERIC_TYPES.has(column.type)
                        ? "text-right"
                        : column.key === "aksi"
                          ? "text-center"
                          : "text-left"
                    }`}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {visibleRows.length === 0 ? (
                <tr>
                  <td
                    colSpan={tableColumns.length}
                    className="px-4 py-10 text-center text-slate-400"
                  >
                    Tidak ada data.
                  </td>
                </tr>
              ) : (
                visibleRows.map((row) => (
                  <Fragment key={row.id}>
                    <tr className="transition-colors hover:bg-slate-50/70">
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={`whitespace-nowrap px-4 py-3 ${
                            NUMERIC_TYPES.has(column.type)
                              ? "text-right text-slate-700"
                              : column.type === "status"
                                ? "text-slate-700"
                                : "text-slate-700"
                          } ${column.type === "currency" ? "font-medium text-slate-900" : ""}`}
                        >
                          {formatCell(row, column, statusMeta)}
                        </td>
                      ))}
                      <td className="whitespace-nowrap px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => toggleDetail(row.id)}
                            className={`rounded-lg p-1.5 transition-colors ${
                              openId === row.id
                                ? "bg-[#0F5C4C]/[0.08] text-[#0F5C4C]"
                                : "text-slate-400 hover:text-[#0F5C4C] hover:bg-[#0F5C4C]/[0.06]"
                            }`}
                            title="Lihat detail"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <ChevronDownIcon
                            className={`h-4 w-4 text-slate-400 transition-transform ${
                              openId === row.id ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </td>
                    </tr>
                    {openId === row.id && detailFields && (
                      <tr className="bg-slate-50/60">
                        <td colSpan={tableColumns.length} className="px-6 py-4">
                          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                            {detailFields(row).map((field) => (
                              <div key={field.label}>
                                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                  {field.label}
                                </span>
                                <p className="text-slate-700">{field.value}</p>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={activePage}
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
