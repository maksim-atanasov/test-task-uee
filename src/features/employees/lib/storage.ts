import { Employee } from "../types";

const STORAGE_KEY = "employees";

export function readStoredEmployees(): Employee[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function storeEmployees(employees: Employee[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

export function clearStoredEmployees() {
  localStorage.removeItem(STORAGE_KEY);
}
