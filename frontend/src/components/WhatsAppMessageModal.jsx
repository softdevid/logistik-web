import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const MESSAGE_TABS = [
  { key: "transaksi", label: "Message WA Transaksi" },
  { key: "shipment", label: "Message WA Shipment Status" },
  { key: "delivery", label: "Message WA Delivery Sheet" },
];

const INITIAL_FORM = {
  transaksi: {
    sender: { penerima: "", message: "", status: true },
    recipient: { penerima: "", message: "", status: true },
  },
  shipment: {
    sender: { penerima: "", message: "", status: true },
  },
  delivery: {
    recipient: { penerima: "", message: "", status: true },
  },
};

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
        checked ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full ${
          checked ? "bg-white" : "bg-slate-400"
        }`}
      />
      {checked ? "ON" : "OFF"}
    </button>
  );
}

function MessageGroup({ title, values, onChange }) {
  const update = (key, val) =>
    onChange((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-4">
      <h4 className="text-sm font-semibold text-slate-700">{title}</h4>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Penerima
        </label>
        <input
          type="text"
          value={values.penerima}
          onChange={(e) => update("penerima", e.target.value)}
          placeholder="Nomor penerima"
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Message
        </label>
        <textarea
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          rows={5}
          placeholder="Isi pesan WhatsApp..."
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F5C4C]/30 focus:border-[#0F5C4C] resize-y"
        />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">Status</span>
        <Toggle
          checked={values.status}
          onChange={(v) => update("status", v)}
        />
      </div>
    </div>
  );
}

export default function WhatsAppMessageModal({ onClose, companyName }) {
  const [activeTab, setActiveTab] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);

  const tabKey = MESSAGE_TABS[activeTab].key;
  const groups = form[tabKey];

  const sectionOrder =
    tabKey === "transaksi"
      ? ["sender", "recipient"]
      : [tabKey === "shipment" ? "sender" : "recipient"];

  const sectionTitle = (key) =>
    tabKey === "transaksi" || key === "sender"
      ? key === "sender"
        ? "Pengirim"
        : "Penerima"
      : "Penerima";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Pesan WhatsApp
            </h3>
            {companyName && (
              <p className="text-xs text-slate-500">{companyName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="border-b border-slate-100 px-6 shrink-0">
          <div className="flex gap-0 overflow-x-auto">
            {MESSAGE_TABS.map((t, i) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-2.5 text-[13px] font-medium border-b-2 whitespace-nowrap transition-colors ${
                  activeTab === i
                    ? "border-[#0F5C4C] text-[#0F5C4C]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {sectionOrder.map((key) => (
            <MessageGroup
              key={key}
              title={sectionTitle(key)}
              values={groups[key]}
              onChange={(fn) =>
                setForm((prev) => ({
                  ...prev,
                  [tabKey]: { ...prev[tabKey], [key]: fn(prev[tabKey][key]) },
                }))
              }
            />
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-[#0F5C4C] rounded-lg hover:bg-[#0C4A3D] transition-colors"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
