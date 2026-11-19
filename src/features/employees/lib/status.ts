import { EmployeeStatus } from "../types";

export const STATUS_LABELS: Record<EmployeeStatus, string> = {
  active: "Працює",
  vacation: "Відпустка",
  sick: "Лікарняний",
  fired: "Звільнений",
};

export function statusLabel(status: EmployeeStatus) {
  return STATUS_LABELS[status];
}
