export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  city: string;
  salary: number;
  rating: number;
  startDate: string;
  status: EmployeeStatus;
  projects: number;
}

export interface DeptMetrics {
  share: number;
  rank: number;
}

export interface EditingState {
  id: number;
  field: EditableField;
}

export interface DepartmentInfo {
  name: string;
  head: string;
  budget: number;
  floor: number;
}

export type EditableField = "position" | "salary";

export interface DepartmentStats {
  count: number;
  avgSalary: number;
  avgRating: number;
}

export interface Stats {
  total: number;
  avg: number;
  active: number;
  best: Employee | null;
  byDepartment: Record<string, DepartmentStats>;
}

export type EmployeeStatus = "active" | "vacation" | "sick" | "fired";
export type SortField = keyof Employee;
export type SortDir = "asc" | "desc";
export type StatusFilter = EmployeeStatus | "all";

export interface EmployeeFilters {
  query: string;
  department: string;
  status: StatusFilter;
}
