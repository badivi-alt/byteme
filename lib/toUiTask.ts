export type Bucket = "TODAY" | "TOMORROW" | "LATER";
export type Status = "open" | "done";

export type UiTask = {
  id: string;
  title: string;
  notes: string | null;
  bucket: Bucket;
  sort: number;
  dueDate: Date | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  userId: string;
  status: Status;
};

function asBucket(b: any): Bucket {
  if (b === "TODAY") return "TODAY";
  if (b === "TOMORROW") return "TOMORROW";
  return "LATER";
}
function asStatus(s: any): Status {
  return String(s).toLowerCase() === "done" ? "done" : "open";
}

export function toUiTasks(rows: any[]): UiTask[] {
  return (rows ?? []).map((t) => ({
    id: String(t.id),
    title: String(t.title ?? ""),
    notes: t.notes ?? null,
    bucket: asBucket(t.bucket),
    sort: Number.isFinite(t.sort) ? t.sort : 0,
    dueDate: t.dueDate ?? null,
    createdAt: t.createdAt ?? new Date().toISOString(),
    updatedAt: t.updatedAt ?? new Date().toISOString(),
    userId: String(t.userId ?? ""),
    status: asStatus(t.status),
  }));
}
