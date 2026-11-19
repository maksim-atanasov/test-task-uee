import { enableArrayMethods, enableMapSet } from "immer";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { fetchEmployees } from "./api";
import {
  clearStoredEmployees,
  readStoredEmployees,
  storeEmployees,
} from "./lib/storage";
import {
  EditableField,
  EditingState,
  Employee,
  SortDir,
  SortField,
  StatusFilter,
} from "./types";

enableMapSet();
enableArrayMethods();

interface EmployeesActions {
  init: () => void;
  reset: () => void;
  setSearch: (search: string) => void;
  setDepartment: (department: string) => void;
  setStatus: (status: StatusFilter) => void;
  toggleSort: (field: SortField) => void;
  toggleSelect: (id: number) => void;
  toggleAll: (ids: number[]) => void;
  deleteSelected: () => void;
  startEdit: (id: number, field: EditableField) => void;
  saveEdit: (id: number, field: EditableField, value: string) => void;
  cancelEdit: () => void;
  openModal: (id: number) => void;
  closeModal: () => void;
}

interface EmployeesState {
  employees: Employee[];
  loading: boolean;
  search: string;
  department: string;
  status: StatusFilter;
  sortField: SortField | null;
  sortDir: SortDir;
  selected: Set<number>;
  editing: EditingState | null;
  modalId: number | null;
  actions: EmployeesActions;
}

const initialEmployees = readStoredEmployees();
let requestId = 0;

export const useEmployeesStore = create<EmployeesState>()(
  immer((set, get) => {
    const load = async () => {
      const id = ++requestId;
      const employees = await fetchEmployees();
      if (id !== requestId) return;
      set((s) => {
        s.employees = employees;
        s.loading = false;
      });
    };

    return {
      employees: initialEmployees,
      loading: initialEmployees.length === 0,
      search: "",
      department: "all",
      status: "all",
      sortField: null,
      sortDir: "asc",
      selected: new Set(),
      editing: null,
      modalId: null,

      actions: {
        init: () => {
          if (get().loading) load();
        },

        reset: () => {
          clearStoredEmployees();
          set((s) => {
            s.loading = true;
            s.selected.clear();
            s.editing = null;
            s.modalId = null;
          });
          load();
        },

        setSearch: (search) =>
          set((s) => {
            s.search = search;
          }),

        setDepartment: (department) =>
          set((s) => {
            s.department = department;
          }),

        setStatus: (status) =>
          set((s) => {
            s.status = status;
          }),

        toggleSort: (field) =>
          set((s) => {
            if (s.sortField === field) {
              s.sortDir = s.sortDir === "asc" ? "desc" : "asc";
            } else {
              s.sortField = field;
              s.sortDir = "asc";
            }
          }),

        toggleSelect: (id) =>
          set((s) => {
            if (s.selected.has(id)) s.selected.delete(id);
            else s.selected.add(id);
          }),

        toggleAll: (ids) =>
          set((s) => {
            const allSelected =
              ids.length > 0 && ids.every((id) => s.selected.has(id));
            for (const id of ids) {
              if (allSelected) s.selected.delete(id);
              else s.selected.add(id);
            }
          }),

        deleteSelected: () =>
          set((s) => {
            s.employees = s.employees.filter((e) => !s.selected.has(e.id));
            s.selected.clear();
          }),

        startEdit: (id, field) =>
          set((s) => {
            s.editing = { id, field };
          }),

        cancelEdit: () =>
          set((s) => {
            s.editing = null;
          }),

        saveEdit: (id, field, value) =>
          set((s) => {
            const employee = s.employees.find((e) => e.id === id);
            if (employee) {
              if (field === "salary") employee.salary = Number(value);
              else employee.position = value;
            }
            s.editing = null;
          }),

        openModal: (id) =>
          set((s) => {
            s.modalId = id;
          }),

        closeModal: () =>
          set((s) => {
            s.modalId = null;
          }),
      },
    };
  }),
);

useEmployeesStore.subscribe((state, prev) => {
  if (!state.loading && state.employees !== prev.employees) {
    storeEmployees(state.employees);
  }
});

export const useEmployeeActions = () => useEmployeesStore((s) => s.actions);
