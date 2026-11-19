import { useMemo } from "react";
import { useEmployeeActions, useEmployeesStore } from "../../store";
import { Employee } from "../../types";

interface Props {
  rows: Employee[];
}

export const SelectAllCheckbox = ({ rows }: Props) => {
  const selected = useEmployeesStore((s) => s.selected);
  const { toggleAll } = useEmployeeActions();

  const allSelected = useMemo(
    () => rows.length > 0 && rows.every((r) => selected.has(r.id)),
    [rows, selected],
  );

  return (
    <input
      type="checkbox"
      checked={allSelected}
      onChange={() => toggleAll(rows.map((r) => r.id))}
    />
  );
};
