export type TaskPriority = "high" | "medium" | "low";

export type Task = {
  id: string;
  title: string;
  note?: string;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD
  done: boolean;
  createdAt: number;
};
