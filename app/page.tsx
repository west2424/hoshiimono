"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { signInWithPopup, signOut } from "firebase/auth";
import { db, auth, googleProvider } from "@/lib/firebase";
import { useAuth } from "@/lib/useAuth";
import { Task } from "@/lib/types";
import TaskCard from "@/components/TaskCard";
import TaskModal, { TaskFormData } from "@/components/TaskModal";

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 } as const;

function sortTasks(tasks: Task[]): Task[] {
  return [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate)
      return a.dueDate < b.dueDate ? -1 : 1;
    if (!!a.dueDate !== !!b.dueDate) return a.dueDate ? -1 : 1;
    if (a.priority !== b.priority)
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    return b.createdAt - a.createdAt;
  });
}

export default function Tasks() {
  const { user, loading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<"all" | "todo" | "done">("all");

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "tasks"), where("ownerUid", "==", user.uid));
    const unsub = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Task)));
    });
    return unsub;
  }, [user]);

  const handleLogin = () => signInWithPopup(auth, googleProvider);
  const handleLogout = () => signOut(auth);

  const handleSave = async (data: TaskFormData) => {
    if (!user) return;
    const payload = {
      title: data.title,
      note: data.note,
      priority: data.priority,
      dueDate: data.dueDate,
    };
    if (editingTask) {
      await updateDoc(doc(db, "tasks", editingTask.id), payload);
    } else {
      await addDoc(collection(db, "tasks"), {
        ...payload,
        done: false,
        createdAt: Date.now(),
        ownerUid: user.uid,
      });
    }
    setShowModal(false);
    setEditingTask(null);
  };

  const handleToggle = async (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    await updateDoc(doc(db, "tasks", id), { done: !task.done });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("削除しますか？")) return;
    await deleteDoc(doc(db, "tasks", id));
  };

  const openEdit = (task: Task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const filtered = sortTasks(
    tasks.filter((t) => {
      if (filter === "todo" && t.done) return false;
      if (filter === "done" && !t.done) return false;
      return true;
    })
  );

  const todoCount = tasks.filter((t) => !t.done).length;

  if (loading) {
    return <div className="min-h-screen bg-pink-50" />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">タスク</h1>
          <p className="text-gray-500 mb-8 text-sm">
            Googleアカウントでログインしてください
          </p>
          <button
            onClick={handleLogin}
            className="bg-pink-500 text-white rounded-xl py-3 font-medium hover:bg-pink-600 transition text-lg w-full"
          >
            Googleでログイン
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">✅ タスク</h1>
            <p className="text-xs text-gray-400">残り{todoCount}件</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleLogout}
              className="text-sm text-gray-400 hover:text-gray-600 transition"
            >
              ログアウト
            </button>
            <button
              onClick={() => {
                setEditingTask(null);
                setShowModal(true);
              }}
              className="bg-pink-500 text-white rounded-full w-10 h-10 text-2xl flex items-center justify-center hover:bg-pink-600 transition shadow"
            >
              +
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-4">
        <div className="flex gap-2 mb-4">
          {(["all", "todo", "done"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm px-3 py-1 rounded-full font-medium transition ${
                filter === f
                  ? "bg-pink-500 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
            >
              {f === "all" ? "すべて" : f === "todo" ? "未完了" : "完了"}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-400 self-center">
            {filtered.length}件
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            <div className="text-5xl mb-3">🎉</div>
            <p>タスクはありません</p>
            <p className="text-sm mt-1">+ ボタンで追加してみよう</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <TaskModal
          editingTask={editingTask}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}
