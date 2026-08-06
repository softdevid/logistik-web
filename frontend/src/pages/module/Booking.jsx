import BookingForm from "@/features/booking/components/BookingForm";
import BookingHeader from "@/features/booking/components/BookingHeader";
import BookingSearch from "@/features/booking/components/BookingSearch";
import BookingTable from "@/features/booking/components/BookingTable";
import useBooking from "@/features/booking/hooks/useBooking";

export default function Booking() {
  const { table, search, form, importDialog } = useBooking();
  return (
    <div className="min-h-full bg-slate-50 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <BookingHeader
          openCreate={form.openCreate}
        />

        <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
          <BookingSearch />

          <BookingTable
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
      <BookingForm
        open={form.formOpen}
        mode={form.editingRow ? "edit" : "create"}
        form={form.form}
        setForm={form.setForm}
        onClose={() => form.setFormOpen(false)}
        onSave={form.handleSave}
        errors={form.formErrors}
      />
    </div>
  );
}
