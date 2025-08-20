"use client";

import { useState } from "react";
import type { Bucket } from "@/lib/toUiTask";

export default function QuickAddTask({ bucket }: { bucket: Bucket }) {
  const [task, setTask] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;
    
    // TODO: Add task creation logic here
    console.log("Adding task:", task, "to bucket:", bucket);
    setTask("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Add a task..."
        className="flex-1 rounded border px-2 py-1 text-sm"
      />
      <button
        type="submit"
        className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
      >
        Add
      </button>
    </form>
  );
}
