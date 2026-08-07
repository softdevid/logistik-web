import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { BRANCH_OPTIONS } from "../constants/branches";

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

function ToolbarInput(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-[#0F5C4C] focus:bg-white focus:ring-2 focus:ring-[#0F5C4C]/20 ${props.className || ""}`}
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

export default function ReportToolbar({
  draftSearch,
  dateFrom,
  dateTo,
  branch,
  selectFilters = [],
  selectValues = {},
  searchable,
  dateField,
  branchField,
  searchPlaceholder,
  onDraftSearchChange,
  onDateFromChange,
  onDateToChange,
  onBranchChange,
  onSelectValueChange,
  onSearch,
  onReset,
  onRefresh,
  loading,
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_200px_200px_200px_200px]">
          {searchable && (
            <ToolbarField label="Pencarian">
              <div className="relative">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <ToolbarInput
                  value={draftSearch}
                  onChange={(e) => onDraftSearchChange(e.target.value)}
                  placeholder={searchPlaceholder || "Cari..."}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onSearch();
                    }
                  }}
                  className="pl-10"
                />
              </div>
            </ToolbarField>
          )}

          {dateField && (
            <>
              <ToolbarField label="Periode - Dari">
                <ToolbarInput
                  type="date"
                  value={dateFrom}
                  onChange={(e) => onDateFromChange(e.target.value)}
                />
              </ToolbarField>
              <ToolbarField label="Periode - Sampai">
                <ToolbarInput
                  type="date"
                  value={dateTo}
                  onChange={(e) => onDateToChange(e.target.value)}
                />
              </ToolbarField>
            </>
          )}

          {branchField && (
            <ToolbarField label="Branch">
              <ToolbarSelect
                value={branch}
                onChange={onBranchChange}
                options={BRANCH_OPTIONS}
              />
            </ToolbarField>
          )}

          {selectFilters.map((filter) => (
            <ToolbarField key={filter.key} label={filter.label}>
              <ToolbarSelect
                value={selectValues?.[filter.key] ?? "all"}
                onChange={(value) => onSelectValueChange(filter.key, value)}
                options={[{ value: "all", label: `Semua ${filter.label}` }, ...filter.options]}
              />
            </ToolbarField>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSearch}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5C4C] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0C4A3D]"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
            Search
          </button>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
