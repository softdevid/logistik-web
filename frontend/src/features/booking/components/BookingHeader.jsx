import { PlusIcon } from "@heroicons/react/24/outline";
import React from "react";

const BookingHeader = ({ openCreate }) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Booking
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
          Kelola Booking
        </h2>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F5C4C] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0C4A3D]"
        >
          <PlusIcon className="h-4 w-4" />
          Tambah Booking
        </button>
      </div>
    </div>
  );
};

export default BookingHeader;
