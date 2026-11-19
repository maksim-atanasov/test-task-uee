import { useState } from "react";
import classNames from "classnames";
import { EmployeesPage } from "@/pages/EmployeesPage";
import { Clock } from "@/shared/ui/Clock";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import "./styles/global.css";

export default function App() {
  const [dark, setDark] = useState(false);

  return (
    <div className={classNames("app", { dark })}>
      <EmployeesPage
        headerActions={
          <>
            <Clock />
            <ThemeToggle isDark={dark} onToggle={() => setDark(!dark)} />
          </>
        }
      />
    </div>
  );
}
