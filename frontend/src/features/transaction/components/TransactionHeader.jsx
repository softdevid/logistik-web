import { ArrowDownTrayIcon, CloudArrowUpIcon, PlusIcon } from "@heroicons/react/24/outline";
import React from "react";

const TransactionHeader = ({handleTemplateDownload, setImportOpen, openCreate}) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Transaction
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          On Site Outbound
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Kelola transaksi outbound on site, impor AWB, dan entry manual dalam
          satu layar.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={handleTemplateDownload}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ArrowDownTrayIcon className="h-4 w-4" />
          Template Import
        </button>
        <button
          type="button"
          onClick={() => setImportOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <CloudArrowUpIcon className="h-4 w-4" />
          Import Data
        </button>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5C4C] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0C4A3D]"
        >
          <PlusIcon className="h-4 w-4" />
          Tambah AWB
        </button>
      </div>
    </div>
  );
};

export default TransactionHeader;
