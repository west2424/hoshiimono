export type WishItem = {
  id: string;
  title: string;
  url: string;
  price?: string;
  note?: string;
  addedBy: string;
  purchased: boolean;
  createdAt: number;
};

export type TaskPriority = "high" | "medium" | "low";

export type Task = {
  id: string;
  title: string;
  note?: string;
  assignee: string;
  priority: TaskPriority;
  dueDate?: string; // YYYY-MM-DD
  done: boolean;
  addedBy: string;
  createdAt: number;
};
