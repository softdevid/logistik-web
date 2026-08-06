import React from 'react'

function TabButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative px-4 py-3 text-sm font-medium transition-colors ${
        active ? "text-[#0F5C4C]" : "text-slate-500 hover:text-slate-700"
      }`}
    >
      {children}
      <span
        className={`absolute inset-x-4 bottom-0 h-0.5 rounded-full transition-colors ${
          active ? "bg-[#0F5C4C]" : "bg-transparent"
        }`}
      />
    </button>
  );
}

export default TabButton