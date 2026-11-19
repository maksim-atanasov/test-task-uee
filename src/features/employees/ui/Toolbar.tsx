import { STATUS_LABELS } from "../lib/status";
import { useEmployeeActions, useEmployeesStore } from "../store";
import { StatusFilter } from "../types";

interface Props {
  departments: string[];
  onExport: () => void;
}

export const Toolbar = ({ departments, onExport }: Props) => {
  const search = useEmployeesStore((s) => s.search);
  const department = useEmployeesStore((s) => s.department);
  const status = useEmployeesStore((s) => s.status);
  const selectedCount = useEmployeesStore((s) => s.selected.size);
  const { setSearch, setDepartment, setStatus, deleteSelected, reset } =
    useEmployeeActions();

  const handleDelete = () => {
    if (window.confirm("Видалити " + selectedCount + " записів?")) {
      deleteSelected();
    }
  };

  return (
    <div className="toolbar">
      <input
        className="search"
        placeholder="Пошук за будь-яким полем"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        <option value="all">Усі відділи</option>
        {departments.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as StatusFilter)}
      >
        <option value="all">Усі статуси</option>
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <button disabled={selectedCount === 0} onClick={handleDelete}>
        Видалити обрані ({selectedCount})
      </button>
      <button onClick={onExport}>Експорт CSV</button>
      <button onClick={reset}>Скинути дані</button>
    </div>
  );
};
