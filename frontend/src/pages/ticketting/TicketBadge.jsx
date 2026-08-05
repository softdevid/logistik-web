export default function TicketBadge({ meta, value }) {
  const m = meta[value];
  if (!m) return <span className="text-slate-400">-</span>;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${m.className}`}
    >
      {m.label}
    </span>
  );
}
