import { useEffect, useMemo } from "react";
import { formatDate, formatMoney } from "@/shared/lib/format";
import { useEmployeeActions, useEmployeesStore } from "../store";

export const EmployeeModal = () => {
  const modalId = useEmployeesStore((s) => s.modalId);
  const employees = useEmployeesStore((s) => s.employees);
  const { closeModal } = useEmployeeActions();

  const employee = useMemo(
    () => employees.find((e) => e.id === modalId) ?? null,
    [employees, modalId],
  );

  const colleagues = useMemo(
    () =>
      employee
        ? employees.filter(
            (e) => e.department === employee.department && e.id !== employee.id,
          )
        : [],
    [employees, employee],
  );

  const isOpen = employee !== null;

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeModal]);

  if (!employee) return null;

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{employee.name}</h2>
        <p>{employee.email}</p>
        <p>
          {employee.position}, {employee.department}, {employee.city}
        </p>
        <p>Зарплата: {formatMoney(employee.salary)}</p>
        <p>Працює з {formatDate(employee.startDate)}</p>
        <h3>Колеги з відділу</h3>
        <ul className="colleagues">
          {colleagues.map((r) => (
            <li key={r.id}>
              {r.name}, {r.position}, {formatMoney(r.salary)}
            </li>
          ))}
        </ul>
        <button onClick={closeModal}>Закрити</button>
      </div>
    </div>
  );
};
