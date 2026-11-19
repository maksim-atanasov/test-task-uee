import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useEmployeeActions, useEmployeesStore } from "../../store";
import { DeptMetrics, Employee, SortField } from "../../types";
import { EmployeeRow } from "./EmployeeRow";
import { SelectAllCheckbox } from "./SelectAllCheckbox";

interface Props {
  rows: Employee[];
  deptMetrics: Map<number, DeptMetrics>;
}

const ROW_HEIGHT = 56;

const columns: { key: SortField | "share"; label: string; width?: number }[] = [
  { key: "id", label: "ID", width: 64 },
  { key: "name", label: "Співробітник" },
  { key: "department", label: "Відділ", width: 120 },
  { key: "position", label: "Посада", width: 100 },
  { key: "city", label: "Місто", width: 150 },
  { key: "salary", label: "Зарплата", width: 130 },
  { key: "share", label: "Частка у відділі", width: 130 },
  { key: "startDate", label: "Дата початку", width: 170 },
  { key: "status", label: "Статус", width: 120 },
  { key: "rating", label: "Рейтинг", width: 90 },
  { key: "projects", label: "Проєкти", width: 90 },
];

export const EmployeeTable = ({ rows, deptMetrics }: Props) => {
  const sortField = useEmployeesStore((s) => s.sortField);
  const sortDir = useEmployeesStore((s) => s.sortDir);
  const { toggleSort } = useEmployeeActions();
  const scrollRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const paddingTop = virtualRows.length ? virtualRows[0].start : 0;
  const paddingBottom = virtualRows.length
    ? virtualizer.getTotalSize() - virtualRows[virtualRows.length - 1].end
    : 0;

  return (
    <div className="table-wrap" ref={scrollRef}>
      <table>
        <thead>
          <tr>
            <th style={{ width: 44 }}>
              <SelectAllCheckbox rows={rows} />
            </th>
            {columns.map((col) => (
              <th
                style={{ width: col.width }}
                key={col.key}
                onClick={() => col.key !== "share" && toggleSort(col.key)}
              >
                {col.label}
                {sortField === col.key ? (sortDir === "asc" ? " ▲" : " ▼") : ""}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paddingTop > 0 && (
            <tr className="spacer">
              <td colSpan={columns.length + 1} style={{ height: paddingTop }} />
            </tr>
          )}
          {virtualRows.map(({ index }) => {
            const row = rows[index];
            const metrics = deptMetrics.get(row.id)!;
            return (
              <EmployeeRow
                key={row.id}
                index={index}
                row={row}
                share={metrics.share}
                rank={metrics.rank}
              />
            );
          })}
          {paddingBottom > 0 && (
            <tr className="spacer">
              <td
                colSpan={columns.length + 1}
                style={{ height: paddingBottom }}
              />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
