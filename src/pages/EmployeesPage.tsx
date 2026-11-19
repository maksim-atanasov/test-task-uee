import { ReactNode, useEffect } from "react";
import { useEmployeesView } from "@/features/employees/hooks/useEmployeesView";
import { downloadCsv, employeesToCsv } from "@/features/employees/lib/csv";
import {
  useEmployeeActions,
  useEmployeesStore,
} from "@/features/employees/store";
import { DepartmentInfoBar } from "@/features/employees/ui/DepartmentInfoBar";
import { EmployeeModal } from "@/features/employees/ui/EmployeeModal";
import { SelectionSummary } from "@/features/employees/ui/SelectionSummary";
import { StatsPanel } from "@/features/employees/ui/StatsPanel";
import { EmployeeTable } from "@/features/employees/ui/table/EmployeeTable";
import { Toolbar } from "@/features/employees/ui/Toolbar";

interface Props {
  headerActions?: ReactNode;
}

export const EmployeesPage = ({ headerActions }: Props) => {
  const loading = useEmployeesStore((s) => s.loading);
  const { init } = useEmployeeActions();
  const { total, filtered, sorted, stats, deptMetrics, departments } =
    useEmployeesView();

  useEffect(() => {
    init();
  }, [init]);

  const exportCsv = () => downloadCsv(employeesToCsv(sorted), "employees.csv");

  return (
    <>
      <header className="header">
        <div>
          <h1>Співробітники</h1>
          <p className="subtitle">
            Усього записів: {total}, показано: {filtered.length}
          </p>
        </div>
        <div className="header-right">{headerActions}</div>
      </header>

      <Toolbar departments={departments} onExport={exportCsv} />
      <StatsPanel stats={stats} />
      <DepartmentInfoBar />
      <SelectionSummary />

      {loading ? (
        <div className="loading">Завантаження...</div>
      ) : (
        <EmployeeTable rows={sorted} deptMetrics={deptMetrics} />
      )}

      <EmployeeModal />
    </>
  );
};
