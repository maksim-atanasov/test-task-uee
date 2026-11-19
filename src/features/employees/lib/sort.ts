import { Employee, SortDir, SortField } from "../types";

const collator = new Intl.Collator("uk");

export function sortEmployees(
  rows: Employee[],
  field: SortField,
  dir: SortDir,
) {
  const sign = dir === "asc" ? 1 : -1;
  return [...rows].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    const res =
      typeof av === "number" && typeof bv === "number"
        ? av - bv
        : collator.compare(String(av), String(bv));
    return res * sign;
  });
}
