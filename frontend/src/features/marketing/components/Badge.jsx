import React from 'react'
import { STATUS_STYLES } from '../constants/status';

function Badge({ value }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        STATUS_STYLES[value] || "bg-slate-100 text-slate-500 ring-1 ring-slate-200"
      }`}
    >
      {value || "-"}
    </span>
  );
}

export default Badge