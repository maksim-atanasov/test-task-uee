import { DepartmentStats, DeptMetrics, Employee, Stats } from "../types";

export function calcStats(rows: Employee[]): Stats {
  let total = 0;
  let active = 0;
  let best: Employee | null = null;
  const sums: Record<
    string,
    { count: number; salary: number; rating: number }
  > = {};

  for (const r of rows) {
    total += r.salary;
    if (r.status === "active") active++;
    if (
      !best ||
      r.rating > best.rating ||
      (r.rating === best.rating && r.projects > best.projects)
    ) {
      best = r;
    }

    let dep = sums[r.department];
    if (!dep) {
      dep = { count: 0, salary: 0, rating: 0 };
      sums[r.department] = dep;
    }
    dep.count++;
    dep.salary += r.salary;
    dep.rating += r.rating;
  }

  const byDepartment: Record<string, DepartmentStats> = {};
  for (const [name, s] of Object.entries(sums)) {
    byDepartment[name] = {
      count: s.count,
      avgSalary: s.salary / s.count,
      avgRating: s.rating / s.count,
    };
  }

  return {
    total,
    avg: rows.length ? total / rows.length : 0,
    active,
    best,
    byDepartment,
  };
}

export function calcDeptMetrics(rows: Employee[]): Map<number, DeptMetrics> {
  const totals = new Map<string, number>();
  const ratings = new Map<string, number[]>();

  for (const r of rows) {
    totals.set(r.department, (totals.get(r.department) ?? 0) + r.salary);
    const list = ratings.get(r.department) ?? [];
    list.push(r.rating);
    ratings.set(r.department, list);
  }
  ratings.forEach((list) => list.sort((a, b) => b - a));

  const result = new Map<number, DeptMetrics>();
  for (const r of rows) {
    result.set(r.id, {
      share: (r.salary / totals.get(r.department)!) * 100,
      rank: ratings.get(r.department)!.indexOf(r.rating) + 1,
    });
  }
  return result;
}
