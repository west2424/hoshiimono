"use client";

import { Task, TaskPriority } from "@/lib/types";

type Props = {
  task: Task;
  onToggle: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
};

const PRIORITY_LABELS: Record<TaskPriority, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  high: "bg-red-100 text-red-600",
  medium: "bg-yellow-100 text-yellow-700",
  low: "bg-gray-100 text-gray-500",
};

function formatDueDate(dueDate: string): string {
  const [, m, d] = dueDate.split("-").map(Number);
  return `${m}/${d}`;
}

function isOverdue(task: Task): boolean {
  if (task.done || !task.dueDate) return false;
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return task.dueDate < todayStr;
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }: Props) {
  const overdue = isOverdue(task);

  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border p-4 flex items-start gap-3 transition-opacity ${
        task.done ? "opacity-50" : ""
      }`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
          task.done
            ? "bg-pink-500 border-pink-500 text-white"
            : "border-gray-300 hover:border-pink-400"
        }`}
        title={task.done ? "未完了に戻す" : "完了にする"}
      >
        {task.done && "✓"}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <button
            onClick={() => onEdit(task)}
            className={`font-semibold text-left text-gray-800 hover:text-pink-500 transition line-clamp-2 break-words ${
              task.done ? "line-through" : ""
            }`}
          >
            {task.title}
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-300 hover:text-red-400 transition text-lg leading-none shrink-0"
            title="削除"
          >
            ×
          </button>
        </div>

        {task.note && (
          <p className="text-sm text-gray-500 break-words mt-1">{task.note}</p>
        )}

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLES[task.priority]}`}
          >
            {PRIORITY_LABELS[task.priority]}
          </span>
          {task.dueDate && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                overdue ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500"
              }`}
            >
              📅 {formatDueDate(task.dueDate)}
              {overdue && " 期限切れ"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
