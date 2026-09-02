"use client";

import { useSyncExternalStore } from "react";

const KEY = "hoshiimono_user";
const EVENT = "hoshiimono_user_change";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(EVENT, callback);
  };
}

export function useLocalUser(): string | null {
  return useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(KEY),
    () => null
  );
}

export function setLocalUser(name: string) {
  localStorage.setItem(KEY, name);
  window.dispatchEvent(new Event(EVENT));
}
