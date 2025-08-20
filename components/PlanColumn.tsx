"use client";

import TaskList from "@/components/TaskList";
import QuickAddTask from "@/components/QuickAddTask";
import type { UiTask, Bucket } from "@/lib/toUiTask";

export default function PlanColumn({
  title,
  bucket,
  initialTasks,
}: {
  title: string;
  bucket: Bucket;
  initialTasks: UiTask[];
}) {
  return (
    <section className="rounded-2xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <span className="text-xs opacity-60">{bucket}</span>
      </div>
      <QuickAddTask bucket={bucket} />
      <div className="mt-3">
        <TaskList initialTasks={initialTasks} />
      </div>
    </section>
  );
}
