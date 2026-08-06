import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React from "react";
import { TextInput } from "./BookingForm";

const BookingSearch = ({draftSearch, setDraftSearch, handleSearch}) => {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
      <div className="grid gap-3 sm:grid-cols-[220px_120px_120px]"></div>

      <div className="w-full lg:max-w-md">
        <label className="mb-1.5 block text-sm font-medium text-slate-700">
          Search
        </label>
        <div className="relative">
          <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <TextInput
            value={draftSearch}
            onChange={setDraftSearch}
            placeholder="Search..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="pl-10"
          />
        </div>
      </div>
    </div>
  );
};

export default BookingSearch;
