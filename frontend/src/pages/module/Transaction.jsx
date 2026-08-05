import useTransaction from "@/features/transaction/hooks/useTransaction";
import TransactionTable from "@/features/transaction/components/TransactionTable";
import TransactionHeader from "@/features/transaction/components/TransactionHeader";
import TransactionFilters from "@/features/transaction/components/TransactionFilters";
import TransactionForm from "@/features/transaction/components/TransactionForm";
import ImportDialog from "@/features/transaction/components/ImportDialog";

export default function Transaction() {
  const { table, search, form, importDialog } = useTransaction();

  return (
    <div className="min-h-full bg-slate-50 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <TransactionHeader
          handleTemplateDownload={importDialog.handleTemplateDownload}
          setImportOpen={importDialog.setImportOpen}
          openCreate={form.openCreate}
        />

        <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
          <TransactionFilters
            draftSearch={search.draftSearch}
            setDraftSearch={search.setDraftSearch}
            handleSearch={search.handleSearch}
          />

          <TransactionTable
            sortKey={table.sortKey}
            sortDir={table.sortDir}
            handleSort={table.handleSort}
            loading={table.loading}
            visibleRows={table.visibleRows}
            openEdit={form.openEdit}
            handleDelete={table.handleDelete}
            page={table.page}
            totalPages={table.totalPages}
            filteredRows={table.filteredRows}
            pageSize={table.pageSize}
            setPage={table.setPage}
            setPageSize={table.setPageSize}
          />
        </div>
      </div>

      <TransactionForm
        open={form.formOpen}
        mode={form.editingRow ? "edit" : "create"}
        form={form.form}
        setForm={form.setForm}
        onClose={() => form.setFormOpen(false)}
        onSave={form.handleSave}
        errors={form.formErrors}
      />

      <ImportDialog
        open={importDialog.importOpen}
        onClose={() => importDialog.setImportOpen(false)}
        onFinish={(importedRows) => {
          if (importedRows?.length) {
            table.setRows((prev) => {
              const nextBase = Math.max(...prev.map((row) => row.id), 0) + 1;
              const mapped = importedRows.map((row, index) => ({
                id: nextBase + index,
                ...row,
              }));
              return [...mapped, ...prev];
            });
          }
          table.startRefresh();
        }}
      />
    </div>
  );
}
