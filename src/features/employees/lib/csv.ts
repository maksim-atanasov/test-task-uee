import { downloadBlob } from "@/shared/lib/download";
import { Employee } from "../types";

const CSV_FIELDS: (keyof Employee)[] = [
  "id",
  "name",
  "email",
  "department",
  "position",
  "city",
  "salary",
  "startDate",
  "status",
  "rating",
  "projects",
];

function escapeCsv(value: unknown): string {
  const text = String(value);
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function employeesToCsv(rows: Employee[]): string {
  const lines = rows.map((r) =>
    CSV_FIELDS.map((field) => escapeCsv(r[field])).join(","),
  );
  return [CSV_FIELDS.join(","), ...lines].join("\n");
}

export function downloadCsv(csv: string, filename: string) {
  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, filename);
}
