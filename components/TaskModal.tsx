"use client";

import { useState } from "react";
import { Task, TaskPriority } from "@/lib/types";

export type TaskFormData = {
  title: string;
  note: string;
  priority: TaskPriority;
  dueDate: string;
};

type Props = {
  editingTask?: Task | null;
  onSave: (data: TaskFormData) => void;
  onClose: () => void;
};

export default function TaskModal({ editingTask, onSave, onClose }: Props) {
  const [title, setTitle] = useState(editingTask?.title ?? "");
  const [note, setNote] = useState(editingTask?.note ?? "");
  const [priority, setPriority] = useState<TaskPriority>(
    editingTask?.priority ?? "medium"
  );
  const [dueDate, setDueDate] = useState(editingTask?.dueDate ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      note: note.trim(),
      priority,
      dueDate,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-5 text-gray-800">
          {editingTask ? "タスクを編集" : "タスクを追加"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              タスク名 *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: ゴミ出し"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              メモ
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="詳細があれば..."
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                優先度
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white"
              >
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                期限
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 rounded-lg py-2 text-gray-600 hover:bg-gray-50 transition"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 bg-pink-500 text-white rounded-lg py-2 font-medium hover:bg-pink-600 transition"
            >
              {editingTask ? "保存する" : "追加する"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
