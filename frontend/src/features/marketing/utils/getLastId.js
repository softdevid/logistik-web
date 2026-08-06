export function getLastId(rows) {
  return rows.reduce((max, row) => Math.max(max, Number(row.id) || 0), 0);
}