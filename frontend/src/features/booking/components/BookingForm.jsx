import React from "react";
import { STATUS_OPTIONS } from "../constants/status";
import { XMarkIcon } from "@heroicons/react/24/outline";

export const emptyForm = {
  awbNo: "",
  date: "",
  doNo: "",
  destination: "",
  sender: "",
  receiver: "",
  koli: "",
  kilo: "",
  volume: "",
  biaya: "",
  status: "Open",
};

export function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-slate-700">
      {children}
      {required && <span className="ml-1 text-rose-500">*</span>}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  className = "",
  ...props
}) {
  return (
    <input
      type={type}
      inputMode={inputMode}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-[#0F5C4C] focus:ring-2 focus:ring-[#0F5C4C]/20 ${className}`}
      {...props}
    />
  );
}

export function SelectInput({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-[#0F5C4C] focus:ring-2 focus:ring-[#0F5C4C]/20"
    >
      {options.map((option) => {
        const optionValue = typeof option === "object" ? option.value : option;
        const optionLabel = typeof option === "object" ? option.label : option;
        return (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        );
      })}
    </select>
  );
}

function ModalShell({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <div className="absolute inset-0 bg-slate-950/45" onClick={onClose} />
      <div className="relative flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mt-1 text-sm text-slate-500">
              Lengkapi data transaksi outbound on site.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[72vh] overflow-y-auto px-6 py-5">{children}</div>
        <div className="border-t border-slate-200 px-6 py-4">{footer}</div>
      </div>
    </div>
  );
}

function BookingForm({ open, mode, form, setForm, onClose, onSave, errors }) {
  if (!open) return null;

  return (
    <ModalShell
      title={mode === "create" ? "Tambah AWB" : "Edit Transaction"}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-end gap-3">
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
            Simpan
          </button>
        </div>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {errors.length > 0 && (
          <div className="sm:col-span-2 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <div className="mb-2 font-semibold">Periksa kembali input Anda</div>
            <ul className="list-disc space-y-1 pl-5">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <FieldLabel required>AWB No.</FieldLabel>
          <TextInput
            value={form.awbNo}
            onChange={(value) => setForm((prev) => ({ ...prev, awbNo: value }))}
            placeholder="AWB-ONS-000001"
          />
        </div>
        <div>
          <FieldLabel required>Tanggal</FieldLabel>
          <TextInput
            type="date"
            value={form.date}
            onChange={(value) => setForm((prev) => ({ ...prev, date: value }))}
          />
        </div>
        <div>
          <FieldLabel required>DO No.</FieldLabel>
          <TextInput
            value={form.doNo}
            onChange={(value) => setForm((prev) => ({ ...prev, doNo: value }))}
            placeholder="DO-000001"
          />
        </div>
        <div>
          <FieldLabel required>Tujuan</FieldLabel>
          <TextInput
            value={form.destination}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, destination: value }))
            }
            placeholder="Jakarta Barat"
          />
        </div>
        <div>
          <FieldLabel required>Pengirim</FieldLabel>
          <TextInput
            value={form.sender}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, sender: value }))
            }
            placeholder="Nama pengirim"
          />
        </div>
        <div>
          <FieldLabel required>Penerima</FieldLabel>
          <TextInput
            value={form.receiver}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, receiver: value }))
            }
            placeholder="Nama penerima"
          />
        </div>
        <div>
          <FieldLabel required>Koli</FieldLabel>
          <TextInput
            type="number"
            inputMode="numeric"
            value={form.koli}
            onChange={(value) => setForm((prev) => ({ ...prev, koli: value }))}
            placeholder="0"
          />
        </div>
        <div>
          <FieldLabel required>Kilo</FieldLabel>
          <TextInput
            type="number"
            inputMode="decimal"
            value={form.kilo}
            onChange={(value) => setForm((prev) => ({ ...prev, kilo: value }))}
            placeholder="0"
          />
        </div>
        <div>
          <FieldLabel required>Volume</FieldLabel>
          <TextInput
            type="number"
            inputMode="decimal"
            value={form.volume}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, volume: value }))
            }
            placeholder="0"
          />
        </div>
        <div>
          <FieldLabel required>Biaya</FieldLabel>
          <TextInput
            type="number"
            inputMode="numeric"
            value={form.biaya}
            onChange={(value) => setForm((prev) => ({ ...prev, biaya: value }))}
            placeholder="0"
          />
        </div>
        <div className="sm:col-span-2">
          <FieldLabel required>Status</FieldLabel>
          <SelectInput
            value={form.status}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, status: value }))
            }
            options={STATUS_OPTIONS}
          />
        </div>
      </div>
    </ModalShell>
  );
}

export default BookingForm;
