import { Employee, EmployeeFilters } from "../types";
import { statusLabel } from "./status";

export function buildSearchIndex(employees: Employee[]): Map<number, string> {
  return new Map(
    employees.map((e) => [
      e.id,
      [...Object.values(e), statusLabel(e.status)].join(" ").toLowerCase(),
    ]),
  );
}

export function filterEmployees(
  employees: Employee[],
  searchIndex: Map<number, string>,
  { query, department, status }: EmployeeFilters,
): Employee[] {
  const q = query.toLowerCase().trim();
  return employees.filter((e) => {
    const matchSearch = searchIndex.get(e.id)!.includes(q);
    const matchDept = department === "all" || e.department === department;
    const matchStatus = status === "all" || e.status === status;
    return matchSearch && matchDept && matchStatus;
  });
}
