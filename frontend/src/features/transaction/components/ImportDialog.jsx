import React, { useRef, useState } from 'react'
import { downloadFailedRows } from '../utils/excel';
import { ArrowDownTrayIcon, CloudArrowUpIcon, DocumentArrowUpIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

function SummaryCard({ label, value }) {
  return (
    <div className="rounded-xl bg-white p-3 ring-1 ring-emerald-200">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-1 text-lg font-semibold text-slate-900">{value}</div>
    </div>
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

function ImportDialog({ open, onClose, onFinish }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState(null);
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  function validateFile(nextFile) {
    const nextErrors = [];
    if (!nextFile) nextErrors.push("File belum dipilih.");
    else if (!nextFile.name.toLowerCase().endsWith(".xlsx"))
      nextErrors.push("Hanya file Excel (.xlsx) yang diperbolehkan.");
    return nextErrors;
  }

  function setSelectedFile(nextFile) {
    const nextErrors = validateFile(nextFile);
    setFile(nextFile || null);
    setErrors(nextErrors);
    setSummary(null);
    setProgress(0);
  }

  async function handleUpload() {
    const nextErrors = validateFile(file);
    if (nextErrors.length) {
      setErrors(nextErrors);
      return;
    }

    setBusy(true);
    setErrors([]);
    for (let step = 1; step <= 10; step += 1) {
      // simulated progress for the import workflow UI
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 120));
      setProgress(step * 10);
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const records = XLSX.utils.sheet_to_json(sheet, { defval: "" });
    const failedRows = [];
    const importedRows = [];

    records.forEach((record, index) => {
      const rowNumber = index + 2;
      const awbNo = String(record["AWB No."] || record.awbNo || "").trim();
      const date = String(record.Tanggal || record.date || "").trim();
      const doNo = String(record["DO No."] || record.doNo || "").trim();
      const destination = String(
        record.Tujuan || record.destination || "",
      ).trim();
      const sender = String(record.Pengirim || record.sender || "").trim();
      const receiver = String(record.Penerima || record.receiver || "").trim();
      const koli = Number(record.Koli ?? record.koli);
      const kilo = Number(record.Kilo ?? record.kilo);
      const volume = Number(record.Volume ?? record.volume);
      const biaya = Number(record["Biaya"] ?? record.biaya);
      const status = String(record.Status || record.status || "Open").trim();

      if (!awbNo || !date || !doNo || !destination || !sender || !receiver) {
        failedRows.push({
          row: rowNumber,
          reason: "Kolom wajib belum lengkap",
        });
        return;
      }

      if ([koli, kilo, volume, biaya].some((value) => Number.isNaN(value))) {
        failedRows.push({
          row: rowNumber,
          reason: "Kolom numerik harus berisi angka",
        });
        return;
      }

      if (Number.isNaN(new Date(`${date}T00:00:00`).getTime())) {
        failedRows.push({ row: rowNumber, reason: "Tanggal tidak valid" });
        return;
      }

      if (!STATUS_OPTIONS.includes(status)) {
        failedRows.push({ row: rowNumber, reason: "Status tidak dikenali" });
        return;
      }

      importedRows.push({
        awbNo,
        date,
        doNo,
        destination,
        sender,
        receiver,
        koli,
        kilo,
        volume,
        biaya,
        status,
      });
    });

    const total = records.length;
    const failed = failedRows.length;
    const imported = importedRows.length;

    setSummary({ total, imported, failed, failedRows });
    setBusy(false);
    onFinish?.(importedRows);
  }

  function handleDrop(event) {
    event.preventDefault();
    setDragActive(false);
    const dropped = event.dataTransfer.files?.[0];
    if (dropped) setSelectedFile(dropped);
  }

  return (
    <ModalShell
      title="Import Data AWB"
      onClose={onClose}
      footer={
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-500">
            Format yang didukung: Excel (.xlsx)
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleUpload}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0F5C4C] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0C4A3D] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CloudArrowUpIcon className="h-4 w-4" />
              Upload
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`rounded-2xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
            dragActive
              ? "border-[#0F5C4C] bg-emerald-50"
              : "border-slate-300 bg-slate-50"
          }`}
        >
          <div className="mx-auto flex max-w-md flex-col items-center gap-3">
            <div className="rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-200">
              <DocumentArrowUpIcon className="h-7 w-7 text-[#0F5C4C]" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">
                Drag & Drop file Excel ke area ini
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Atau pilih file dari perangkat Anda.
              </p>
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
            >
              Browse File
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              className="hidden"
            />
            {file && (
              <div className="text-sm font-medium text-slate-700">
                File: {file.name}
              </div>
            )}
          </div>
        </div>

        {errors.length > 0 && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            <div className="mb-2 flex items-center gap-2 font-semibold">
              <ExclamationTriangleIcon className="h-4 w-4" />
              Validasi gagal
            </div>
            <ul className="list-disc space-y-1 pl-5">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {busy && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
              <span>Uploading...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#0F5C4C] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {summary && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
            <div className="grid gap-2 sm:grid-cols-3">
              <SummaryCard label="Rows" value={summary.total} />
              <SummaryCard label="Imported" value={summary.imported} />
              <SummaryCard label="Failed" value={summary.failed} />
            </div>
            {summary.failedRows?.length > 0 && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-white p-3 text-slate-700">
                <div className="mb-2 font-semibold">Failed rows</div>
                <div className="space-y-1 text-sm">
                  {summary.failedRows.map((row) => (
                    <div key={row.row}>
                      Row {row.row}: {row.reason}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => downloadFailedRows(summary.failedRows)}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Download failed rows
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </ModalShell>
  );
}

export default ImportDialog