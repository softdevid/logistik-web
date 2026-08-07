export const BRANCHES = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Semarang",
  "Medan",
];

export const BRANCH_OPTIONS = [
  { value: "all", label: "Semua Cabang" },
  ...BRANCHES.map((branch) => ({ value: branch, label: `Cabang ${branch}` })),
];
