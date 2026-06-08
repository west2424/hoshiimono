"use client";

import { WishItem } from "@/lib/types";

type Props = {
  item: WishItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function WishCard({ item, onToggle, onDelete }: Props) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border p-4 flex flex-col gap-2 transition-opacity ${
        item.purchased ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-gray-800 hover:text-pink-500 transition line-clamp-2 break-words"
          >
            {item.title}
          </a>
          {item.price && (
            <p className="text-sm text-pink-500 font-medium mt-0.5">{item.price}</p>
          )}
        </div>
        <button
          onClick={() => onDelete(item.id)}
          className="text-gray-300 hover:text-red-400 transition text-lg leading-none shrink-0"
          title="削除"
        >
          ×
        </button>
      </div>

      {item.note && (
        <p className="text-sm text-gray-500 break-words">{item.note}</p>
      )}

      <div className="flex items-center justify-between mt-1">
        <span className="text-xs text-gray-400">
          {item.addedBy} が追加
        </span>
        <button
          onClick={() => onToggle(item.id)}
          className={`text-xs px-3 py-1 rounded-full font-medium transition ${
            item.purchased
              ? "bg-green-100 text-green-600 hover:bg-green-200"
              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          {item.purchased ? "購入済み" : "未購入"}
        </button>
      </div>
    </div>
  );
}
