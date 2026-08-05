import React from "react";
import { FieldLabel, TextInput } from "./TransactionForm";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const TransactionFilters = ({draftSearch, setDraftSearch, handleSearch}) => {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
      <div className="grid gap-3 sm:grid-cols-[220px_120px_120px]"></div>

      <div className="w-full lg:max-w-md">
        <FieldLabel>Search</FieldLabel>
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

export default TransactionFilters;
