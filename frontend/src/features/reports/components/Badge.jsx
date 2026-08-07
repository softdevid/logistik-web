export default function Badge({ value, meta }) {
  const item = meta?.[value];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
        item?.className || "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      {item?.label || value || "-"}
    </span>
  );
}
