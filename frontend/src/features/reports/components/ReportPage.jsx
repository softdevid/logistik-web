import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import useReportData from "../hooks/useReportData";
import useReportTable from "../hooks/useReportTable";
import ReportToolbar from "./ReportToolbar";
import ReportTable from "./ReportTable";
import SummaryCards from "./SummaryCards";
import { downloadReport } from "../utils/excel";

export default function ReportPage({
  title,
  subtitle,
  columns,
  seedRows = [],
  summaries = [],
  dateField,
  branchField,
  selectFilters = [],
  searchFields = [],
  searchPlaceholder = "Cari...",
  searchable = true,
  statusMeta,
  endpoint,
  mapRow,
  fileName,
}) {
  const { rows, loading, setRows } = useReportData({ seedRows, endpoint, mapRow });
  const table = useReportTable({
    rows,
    columns,
    searchFields,
    dateField,
    branchField,
    selectFilters,
  });

  function handleExport() {
    downloadReport(
      table.filteredRows,
      columns,
      fileName || `${title.toLowerCase().replace(/\s+/g, "-")}.xlsx`,
      title,
      statusMeta,
    );
  }

  function handleRefresh() {
    setRows(seedRows);
  }

  return (
    <div className="min-h-full bg-slate-50 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Laporan Cabang
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
            )}
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5C4C] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0C4A3D]"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Export Excel
          </button>
        </div>

        {summaries.length > 0 && (
          <SummaryCards summaries={summaries} rows={table.filteredRows} />
        )}

        <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <ReportToolbar
            draftSearch={table.draftSearch}
            dateFrom={table.dateFrom}
            dateTo={table.dateTo}
            branch={table.branch}
            selectFilters={selectFilters}
            selectValues={table.selectValues}
            searchable={searchable && searchFields.length > 0}
            dateField={dateField}
            branchField={branchField}
            searchPlaceholder={searchPlaceholder}
            onDraftSearchChange={table.setDraftSearch}
            onDateFromChange={table.setDateFrom}
            onDateToChange={table.setDateTo}
            onBranchChange={table.setBranch}
            onSelectValueChange={table.setSelectValue}
            onSearch={table.handleSearch}
            onReset={table.handleReset}
            onRefresh={handleRefresh}
            loading={loading}
          />

          <ReportTable
            columns={columns}
            loading={loading}
            visibleRows={table.visibleRows}
            filteredRows={table.filteredRows}
            sortKey={table.sortKey}
            sortDir={table.sortDir}
            handleSort={table.handleSort}
            statusMeta={statusMeta}
            page={table.page}
            totalPages={table.totalPages}
            pageSize={table.pageSize}
            setPage={table.setPage}
            setPageSize={table.setPageSize}
          />
        </div>
      </div>
    </div>
  );
}
