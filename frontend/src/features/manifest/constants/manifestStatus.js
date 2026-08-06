export const MANIFEST_STATUS_OPTIONS = [
  { value: "Draft", label: "Draft" },
  { value: "Transit", label: "Transit" },
  { value: "Inbound", label: "Inbound" },
  { value: "Completed", label: "Completed" },
];

export const MANIFEST_STATUS_META = {
  Draft: {
    label: "Draft",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  Transit: {
    label: "Transit",
    className: "bg-sky-50 text-sky-700 ring-sky-200",
  },
  Inbound: {
    label: "Inbound",
    className: "bg-violet-50 text-violet-700 ring-violet-200",
  },
  Completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
};

export const MANIFEST_DEFAULT_STATUS = MANIFEST_STATUS_OPTIONS[0].value;
