import {
  formatReportCurrency,
  formatReportNumber,
  formatReportPercent,
} from "../utils/formatters";

function formatValue(value, format) {
  switch (format) {
    case "currency":
      return formatReportCurrency(value);
    case "number":
      return formatReportNumber(value);
    case "percent":
      return formatReportPercent(value);
    default:
      return value;
  }
}

export default function SummaryCards({ summaries, rows }) {
  const computed = summaries.map((summary) => {
    let value;

    switch (summary.type) {
      case "count":
        value = rows.length;
        break;
      case "countIf":
        value = rows.filter((row) => String(row[summary.key] ?? "") === summary.value).length;
        break;
      case "sum":
        value = rows.reduce((acc, row) => acc + (Number(row[summary.key]) || 0), 0);
        break;
      case "sumIf":
        value = rows
          .filter((row) => String(row[summary.key] ?? "") === summary.value)
          .reduce((acc, row) => acc + (Number(row[summary.sumKey]) || 0), 0);
        break;
      case "avgPercent":
        value = rows.length
          ? rows.reduce((acc, row) => acc + (Number(row[summary.key]) || 0), 0) / rows.length
          : 0;
        break;
      default:
        value = 0;
    }

    return { ...summary, value };
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {computed.map((summary) => (
        <div
          key={summary.label}
          className="rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            {summary.label}
          </p>
          <p className="mt-1.5 text-2xl font-semibold tracking-tight text-slate-900">
            {formatValue(summary.value, summary.format)}
          </p>
        </div>
      ))}
    </div>
  );
}
