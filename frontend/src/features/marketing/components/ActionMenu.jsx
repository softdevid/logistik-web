import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import React, { useState } from 'react'

function ActionMenu({ items, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-flex justify-center">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex items-center justify-center rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        aria-label="Buka menu aksi"
      >
        <EllipsisVerticalIcon className="h-5 w-5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.key}
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

export default ActionMenu