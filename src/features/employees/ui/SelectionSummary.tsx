import { useMemo } from "react";
import { formatMoney } from "@/shared/lib/format";
import { useEmployeesStore } from "../store";

export const SelectionSummary = () => {
  const selected = useEmployeesStore((s) => s.selected);
  const employees = useEmployeesStore((s) => s.employees);

  const totalSalary = useMemo(
    () =>
      employees.reduce(
        (sum, e) => (selected.has(e.id) ? sum + e.salary : sum),
        0,
      ),
    [employees, selected],
  );

  if (selected.size === 0) return null;

  return (
    <div className="selected-info">
      Обрано {selected.size}, сума зарплат: {formatMoney(totalSalary)}
    </div>
  );
};
