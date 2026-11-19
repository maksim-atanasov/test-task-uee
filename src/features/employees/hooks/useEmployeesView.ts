import { useDeferredValue, useMemo } from "react";
import { buildSearchIndex, filterEmployees } from "../lib/search";
import { sortEmployees } from "../lib/sort";
import { calcDeptMetrics, calcStats } from "../lib/stats";
import { useEmployeesStore } from "../store";

export function useEmployeesView() {
  const employees = useEmployeesStore((s) => s.employees);
  const search = useEmployeesStore((s) => s.search);
  const department = useEmployeesStore((s) => s.department);
  const status = useEmployeesStore((s) => s.status);
  const sortField = useEmployeesStore((s) => s.sortField);
  const sortDir = useEmployeesStore((s) => s.sortDir);
  const query = useDeferredValue(search);

  const searchIndex = useMemo(() => buildSearchIndex(employees), [employees]);

  const filtered = useMemo(
    () => filterEmployees(employees, searchIndex, { query, department, status }),
    [employees, searchIndex, query, department, status],
  );

  const sorted = useMemo(
    () => (sortField ? sortEmployees(filtered, sortField, sortDir) : filtered),
    [filtered, sortField, sortDir],
  );

  const stats = useMemo(() => calcStats(filtered), [filtered]);
  const deptMetrics = useMemo(() => calcDeptMetrics(filtered), [filtered]);

  const departments = useMemo(
    () => [...new Set(employees.map((e) => e.department))],
    [employees],
  );

  return {
    total: employees.length,
    filtered,
    sorted,
    stats,
    deptMetrics,
    departments,
  };
}
