import { XMarkIcon } from '@heroicons/react/24/outline';
import React from 'react'
import FormField from './FormField';

function ManagementModal({ title, fields, form, setForm, onClose, onSave, saveLabel = "Simpan" }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-950/45" onClick={onClose} />
      <div className="relative flex w-full max-w-2xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-0.5 text-sm text-slate-500">Perubahan disimpan di data lokal halaman ini.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
          {fields.map((field) => (
            <div key={field.key} className={field.className || ""}>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {field.label}
                {field.required && <span className="ml-1 text-rose-500">*</span>}
              </label>
              <FormField
                field={field}
                value={form[field.key] ?? ""}
                onChange={(value) => setForm((prev) => ({ ...prev, [field.key]: value }))}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-lg bg-[#0F5C4C] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0C4A3D]"
          >
            {saveLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ManagementModal