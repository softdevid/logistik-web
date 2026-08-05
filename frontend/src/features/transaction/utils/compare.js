export function compareValues(a, b, type) {
  if (type === "number") return Number(a || 0) - Number(b || 0);
  if (type === "date")
    return new Date(`${a || ""}T00:00:00`) - new Date(`${b || ""}T00:00:00`);
  return String(a || "").localeCompare(String(b || ""), "id", {
    numeric: true,
    sensitivity: "base",
  });
}