import React from 'react'
import { CONSIGNEE_CONFIG } from '../constants/consignee';
import Badge from './Badge';
import ActionMenu from './ActionMenu';

function ConsigneeTable({ rows, onRowAction }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-y-scroll">
        <table className="w-full text-sm" style={{ minWidth: 980 }}>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              {CONSIGNEE_CONFIG.columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left font-medium text-slate-600 ${column.width || ""}`}
                >
                  {column.label}
                </th>
              ))}
              <th className="px-4 py-3 text-center font-medium text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={CONSIGNEE_CONFIG.columns.length + 1} className="px-4 py-10 text-center text-sm text-slate-400">
                  Tidak ada data {CONSIGNEE_CONFIG.label.toLowerCase()}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50/60">
                  {CONSIGNEE_CONFIG.columns.map((column) => (
                    <td key={column.key} className="px-4 py-3 align-middle text-slate-700">
                      {column.key === "id" ? (
                        <span className="font-medium text-slate-500">{row.id}</span>
                      ) : column.badge ? (
                        <Badge value={row[column.key]} />
                      ) : (
                        <span className={column.key === "name" ? "font-medium text-slate-900" : ""}>
                          {row[column.key] || "-"}
                        </span>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center">
                    <ActionMenu items={CONSIGNEE_CONFIG.rowActions} onSelect={(action) => onRowAction(action, row)} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ConsigneeTable