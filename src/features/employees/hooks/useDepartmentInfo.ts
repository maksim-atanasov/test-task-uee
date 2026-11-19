import { useEffect, useState } from "react";
import { fetchDepartmentInfo } from "../api";
import { DepartmentInfo } from "../types";

export function useDepartmentInfo(department: string) {
  const [info, setInfo] = useState<DepartmentInfo | null>(null);

  useEffect(() => {
    setInfo(null);
    if (department === "all") return;
    let cancelled = false;
    fetchDepartmentInfo(department).then((res) => {
      if (!cancelled) setInfo(res);
    });
    return () => {
      cancelled = true;
    };
  }, [department]);

  return info;
}
