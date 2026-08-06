import { ChevronDownIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react'

function DropdownMenu({ label, items, onSelect, align = "right" }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50"
      >
        {label}
        <ChevronDownIcon className="h-4 w-4" />
      </button>
      {open && (
        <div
          className={`absolute top-full z-30 mt-2 min-w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  setOpen(false);
                  onSelect(item);
                }}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  item.destructive
                    ? "text-rose-600 hover:bg-rose-50"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {Icon && <Icon className="h-4 w-4" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DropdownMenu