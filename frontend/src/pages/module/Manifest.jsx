import {
  ManifestForm,
  ManifestTable,
  ManifestToolbar,
  useManifest,
} from "@/features/manifest";

export default function Manifest() {
  const { form, table, loading, refresh } = useManifest();

  return (
    <div className="min-h-full bg-slate-50 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <ManifestForm
          form={form.form}
          errors={form.errors}
          submitting={form.submitting}
          onChange={form.handleChange}
          onSubmit={form.handleSubmit}
        />

        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="px-5 pt-5 sm:px-6">
            <div className="mb-5 flex flex-col gap-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Manifest
              </p>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                Daftar Manifest
              </h2>
            </div>
          </div>

          <ManifestToolbar
            draftSearch={table.draftSearch}
            periodFrom={table.periodFrom}
            periodTo={table.periodTo}
            onDraftSearchChange={table.setDraftSearch}
            onPeriodFromChange={table.setPeriodFrom}
            onPeriodToChange={table.setPeriodTo}
            onSearch={table.handleSearch}
            onRefresh={refresh}
            loading={loading}
          />

          <ManifestTable
            loading={loading}
            visibleRows={table.visibleRows}
            sortKey={table.sortKey}
            sortDir={table.sortDir}
            handleSort={table.handleSort}
            page={table.page}
            totalPages={table.totalPages}
            filteredRows={table.filteredRows}
            pageSize={table.pageSize}
            setPage={table.setPage}
            setPageSize={table.setPageSize}
          />
        </section>
      </div>
    </div>
  );
}