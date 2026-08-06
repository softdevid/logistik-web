import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import useMarketing from "@/features/marketing/hooks/useMarketing";
import MarketingHeader from "@/features/marketing/components/MarketingHeader";
import MarketingTabs from "@/features/marketing/components/MarketingTabs";
import ManagementModal from "@/features/marketing/components/ManagementModal";
import CustomerTable from "@/features/marketing/components/CustomerTable";
import ConsigneeTable from "@/features/marketing/components/ConsigneeTable";
import DropdownMenu from "@/features/marketing/components/DropdownMenu";

export default function Marketing() {
  const { tab, table, modal, tools } = useMarketing();

  return (
    <div className="min-h-full bg-slate-50 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <MarketingHeader />

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <MarketingTabs
            activeTab={tab.activeTab}
            setActiveTab={tab.setActiveTab}
          />

          <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <button
                type="button"
                onClick={modal.openCreate}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F5C4C] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0C4A3D] lg:w-auto"
              >
                <PlusIcon className="h-4 w-4" />
                Tambah
              </button>

              <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                <div className="text-right sm:ml-auto">
                  <DropdownMenu
                    label="Tools"
                    items={tools.toolsItems}
                    onSelect={tools.handleToolsSelect}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={tab.search}
                  onChange={(e) =>
                    tab.setSearchByTab((prev) => ({
                      ...prev,
                      [tab.activeTab]: e.target.value,
                    }))
                  }
                  placeholder={tab.config.searchPlaceholder}
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-10 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-[#0F5C4C] focus:bg-white focus:ring-2 focus:ring-[#0F5C4C]/20"
                />
              </div>

              <div className="flex items-center justify-between gap-2 lg:justify-end">
                <span className="text-sm text-slate-500">Last ID :</span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                  {table.lastId || "-"}
                </span>
              </div>
            </div>

            {tools.toolsAction && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {tools.toolsAction} dipilih. Hubungkan ke proses impor/ekspor ketika
                endpoint tersedia.
              </div>
            )}

            {tab.activeTab === "customer" ? (
              <CustomerTable
                rows={table.filteredRows}
                onRowAction={table.handleRowAction}
              />
            ) : (
              <ConsigneeTable
                rows={table.filteredRows}
                onRowAction={table.handleRowAction}
              />
            )}
          </div>
        </div>
      </div>

      {modal.modalState && (
        <ManagementModal
          title={
            modal.modalState.type === "create"
              ? `Tambah ${tab.config.editTitle}`
              : modal.modalState.type === "edit"
                ? `Edit ${tab.config.editTitle}`
                : modal.modalState.type === "pricing"
                  ? "Edit Harga/Koli"
                  : "Edit Trucking"
          }
          fields={modal.modalFields}
          form={modal.modalState.form}
          setForm={(updater) =>
            modal.setModalState((prev) => {
              if (!prev) return prev;
              const nextForm =
                typeof updater === "function" ? updater(prev.form) : updater;
              return { ...prev, form: nextForm };
            })
          }
          onClose={() => modal.setModalState(null)}
          onSave={modal.handleSave}
          saveLabel="Simpan"
        />
      )}
    </div>
  );
}
