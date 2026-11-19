import { memo } from "react";
import classNames from "classnames";
import { formatDate, formatMoney } from "@/shared/lib/format";
import { statusLabel } from "../../lib/status";
import { useEmployeeActions, useEmployeesStore } from "../../store";
import { Employee } from "../../types";
import { EditingCell } from "./EditingCell";

interface Props {
  row: Employee;
  index: number;
  share: number;
  rank: number;
}

export const EmployeeRow = memo(({ row, index, share, rank }: Props) => {
  const isSelected = useEmployeesStore((s) => s.selected.has(row.id));
  const editingField = useEmployeesStore((s) =>
    s.editing?.id === row.id ? s.editing.field : null,
  );
  const { toggleSelect, openModal, startEdit, saveEdit, cancelEdit } =
    useEmployeeActions();

  return (
    <tr
      onClick={() => openModal(row.id)}
      className={classNames("employee-row", {
        "is-odd": index % 2 === 1,
        "is-selected": isSelected,
      })}
    >
      <td onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelect(row.id)}
        />
      </td>
      <td>{row.id}</td>
      <td>
        <div style={{ fontWeight: 600 }}>{row.name}</div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>{row.email}</div>
      </td>
      <td>{row.department}</td>
      <td
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={() => startEdit(row.id, "position")}
      >
        {editingField === "position" ? (
          <EditingCell
            value={row.position}
            onSave={(value) => saveEdit(row.id, "position", value)}
            onCancel={cancelEdit}
          />
        ) : (
          row.position
        )}
      </td>
      <td>{row.city}</td>
      <td
        style={{ textAlign: "right", whiteSpace: "nowrap" }}
        onClick={(e) => e.stopPropagation()}
        onDoubleClick={() => startEdit(row.id, "salary")}
      >
        {editingField === "salary" ? (
          <EditingCell
            type="number"
            value={row.salary}
            onSave={(value) => saveEdit(row.id, "salary", value)}
            onCancel={cancelEdit}
          />
        ) : (
          formatMoney(row.salary)
        )}
      </td>
      <td style={{ textAlign: "right" }}>{share.toFixed(2)}%</td>
      <td style={{ whiteSpace: "nowrap" }}>{formatDate(row.startDate)}</td>
      <td>
        <span className={"status status-" + row.status}>
          {statusLabel(row.status)}
        </span>
      </td>
      <td style={{ textAlign: "right" }}>
        {row.rating}{" "}
        <span style={{ opacity: 0.5, fontSize: 12 }}>#{rank}</span>
      </td>
      <td style={{ textAlign: "right" }}>{row.projects}</td>
    </tr>
  );
});
