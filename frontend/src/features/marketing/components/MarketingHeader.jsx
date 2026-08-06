import React from "react";

const MarketingHeader = () => {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        Pemasaran / Penjualan
      </p>
      {/* <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Customer & Consignee Management
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Kelola data customer dan consignee dalam satu halaman dengan
            struktur yang konsisten.
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default MarketingHeader;
