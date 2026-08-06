import { MANIFEST_DEFAULT_STATUS, MANIFEST_STATUS_OPTIONS } from "../constants";

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-slate-700">
      {children}
      {required && <span className="ml-1 text-rose-500">*</span>}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-[#0F5C4C] focus:ring-2 focus:ring-[#0F5C4C]/20"
    />
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:border-[#0F5C4C] focus:ring-2 focus:ring-[#0F5C4C]/20"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default function ManifestForm({ form, errors, submitting, onChange, onSubmit }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-sm sm:px-6">
      <div className="mb-5 flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Manifest
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Tambah Manifest
        </h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {errors.length > 0 && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <div className="mb-2 font-semibold">Periksa kembali input Anda</div>
            <ul className="list-disc space-y-1 pl-5">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <FieldLabel required>Manifest No</FieldLabel>
            <TextInput
              value={form.manifestNo}
              onChange={(value) => onChange("manifestNo", value)}
              placeholder="MAN-2026-0006"
            />
          </div>

          <div>
            <FieldLabel required>Tanggal</FieldLabel>
            <TextInput
              type="date"
              value={form.date}
              onChange={(value) => onChange("date", value)}
            />
          </div>

          <div>
            <FieldLabel required>Driver</FieldLabel>
            <TextInput
              value={form.driver}
              onChange={(value) => onChange("driver", value)}
              placeholder="Nama driver"
            />
          </div>

          <div>
            <FieldLabel required>Nopol</FieldLabel>
            <TextInput
              value={form.nopol}
              onChange={(value) => onChange("nopol", value)}
              placeholder="B 1234 ABC"
            />
          </div>

          <div className="lg:col-span-2">
            <FieldLabel required>Status</FieldLabel>
            <SelectInput
              value={form.status || MANIFEST_DEFAULT_STATUS}
              onChange={(value) => onChange("status", value)}
              options={MANIFEST_STATUS_OPTIONS}
            />
          </div>
        </div>

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-xl bg-[#0F5C4C] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#0C4A3D] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Menyimpan..." : "Simpan Manifest"}
          </button>
        </div>
      </form>
    </section>
  );
}
