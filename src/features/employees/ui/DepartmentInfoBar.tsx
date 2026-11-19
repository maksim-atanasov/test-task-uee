import { formatMoney } from "@/shared/lib/format";
import { useDepartmentInfo } from "../hooks/useDepartmentInfo";
import { useEmployeesStore } from "../store";

export const DepartmentInfoBar = () => {
  const department = useEmployeesStore((s) => s.department);
  const info = useDepartmentInfo(department);

  if (!info) return null;

  return (
    <div className="dept-info">
      Відділ «{info.name}»: керівник {info.head}, бюджет{" "}
      {formatMoney(info.budget)}, поверх {info.floor}
    </div>
  );
};
