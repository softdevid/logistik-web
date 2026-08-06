import { ArrowPathIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function ToolbarField({ label, children }) {
  return (
    <div className="flex-1 min-w-0">
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

export default function ManifestToolbar({
  draftSearch,
  periodFrom,
  periodTo,
  onDraftSearchChange,
  onPeriodFromChange,
  onPeriodToChange,
  onSearch,
  onRefresh,
  loading,
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="grid gap-3 sm:grid-cols-2 lg:flex-1 lg:grid-cols-[1fr_220px_220px]">
          <ToolbarField label="Search Manifest No">
            <div className="relative">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <ToolbarInput
                value={draftSearch}
                onChange={(e) => onDraftSearchChange(e.target.value)}
                placeholder="Cari manifest no..."
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

          <ToolbarField label="Filter Periode - Dari">
            <ToolbarInput
              type="date"
              value={periodFrom}
              onChange={(e) => onPeriodFromChange(e.target.value)}
            />
          </ToolbarField>

          <ToolbarField label="Filter Periode - Sampai">
            <ToolbarInput
              type="date"
              value={periodTo}
              onChange={(e) => onPeriodToChange(e.target.value)}
            />
          </ToolbarField>
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
