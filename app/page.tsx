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
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { WishItem } from "@/lib/types";
import WishCard from "@/components/WishCard";
import AddItemModal from "@/components/AddItemModal";

const USERS = ["自分", "パートナー"];

export default function Home() {
  const [items, setItems] = useState<WishItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unpurchased" | "purchased">("all");

  useEffect(() => {
    const stored = localStorage.getItem("hoshiimono_user");
    if (stored) setUserName(stored);
  }, []);

  useEffect(() => {
    const q = query(collection(db, "wishes"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      setItems(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as WishItem)));
    });
    return unsub;
  }, []);

  const selectUser = (name: string) => {
    localStorage.setItem("hoshiimono_user", name);
    setUserName(name);
  };

  const handleAdd = async (data: { title: string; url: string; price: string; note: string }) => {
    await addDoc(collection(db, "wishes"), {
      ...data,
      addedBy: userName,
      purchased: false,
      createdAt: Date.now(),
    });
    setShowModal(false);
  };

  const handleToggle = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    await updateDoc(doc(db, "wishes", id), { purchased: !item.purchased });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("削除しますか？")) return;
    await deleteDoc(doc(db, "wishes", id));
  };

  const filtered = items.filter((i) => {
    if (filter === "unpurchased") return !i.purchased;
    if (filter === "purchased") return i.purchased;
    return true;
  });

  if (!userName) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm text-center">
          <div className="text-5xl mb-4">🛍️</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ほしいもの</h1>
          <p className="text-gray-500 mb-8 text-sm">あなたはどちらですか？</p>
          <div className="flex flex-col gap-3">
            {USERS.map((u) => (
              <button
                key={u}
                onClick={() => selectUser(u)}
                className="bg-pink-500 text-white rounded-xl py-3 font-medium hover:bg-pink-600 transition text-lg"
              >
                {u}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">🛍️ ほしいもの</h1>
            <p className="text-xs text-gray-400">{userName} としてログイン中</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-pink-500 text-white rounded-full w-10 h-10 text-2xl flex items-center justify-center hover:bg-pink-600 transition shadow"
          >
            +
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto px-4 py-4">
        <div className="flex gap-2 mb-4">
          {(["all", "unpurchased", "purchased"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm px-3 py-1 rounded-full font-medium transition ${
                filter === f
                  ? "bg-pink-500 text-white"
                  : "bg-white text-gray-500 hover:bg-gray-100"
              }`}
            >
              {f === "all" ? "すべて" : f === "unpurchased" ? "未購入" : "購入済み"}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-400 self-center">{filtered.length}件</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-gray-400 py-16">
            <div className="text-5xl mb-3">🎁</div>
            <p>まだ何もありません</p>
            <p className="text-sm mt-1">+ ボタンで追加してみよう</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((item) => (
              <WishCard
                key={item.id}
                item={item}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <AddItemModal onAdd={handleAdd} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
