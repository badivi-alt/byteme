"use client";

import type { UiTask, Bucket } from "@/lib/toUiTask";

export default function DndPlanBoard({
  initial,
}: {
  initial: { TODAY: UiTask[]; TOMORROW: UiTask[]; LATER: UiTask[] };
}) {
  const buckets: Bucket[] = ["TODAY", "TOMORROW", "LATER"];
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {buckets.map((b) => (
        <section key={b} className="rounded-2xl border p-4">
          <h2 className="mb-3 text-lg font-semibold">{b}</h2>
          <ul className="space-y-2">
            {(initial[b] ?? []).map((t) => (
              <li key={t.id} className="rounded-xl border p-3">
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {t.status === "done" ? "✅ " : ""}
                    {t.title}
                  </p>
                  {t.notes ? (
                    <p className="text-sm opacity-70 truncate">{t.notes}</p>
                  ) : null}
                </div>
              </li>
            ))}
            {(initial[b] ?? []).length === 0 && (
              <li className="text-sm opacity-60 italic">No tasks</li>
            )}
          </ul>
        </section>
      ))}
    </div>
  );
}
