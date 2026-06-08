"use client";

import { useState } from "react";

type Props = {
  onAdd: (item: { title: string; url: string; price: string; note: string }) => void;
  onClose: () => void;
};

export default function AddItemModal({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    onAdd({ title: title.trim(), url: url.trim(), price: price.trim(), note: note.trim() });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-5 text-gray-800">欲しいものを追加</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">商品名 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: AirPods Pro"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL *</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">価格</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="例: ¥38,800"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="色やサイズなど..."
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
            />
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
              追加する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
