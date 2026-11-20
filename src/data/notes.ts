/**
 * メモの保存先（仮の実装）：端末の localStorage に保存する。
 * バックエンドを決めたら、公開 API（NotesState・useNotes・addNote）の形を保ったまま中身を置き換える。
 * デモモードでは、同名の src/demo/notes.ts に差し替わる（src/demo/vite-plugin.ts）。
 */
import { useMemo, useSyncExternalStore } from "react";
import { sortNewestFirst } from "@/lib/notes";
import type { Note } from "@/lib/types";

/** 画面に渡すメモの状態。読み込み中と失敗を、画面が同じ形で扱えるようにする。 */
export type NotesState = {
  notes: Note[];
  loading: boolean;
  error: string | null;
};

const KEY = "notes";
const listeners = new Set<() => void>();
let cache: Note[] | null = null;

function read(): Note[] {
  if (cache) return cache;
  try {
    const stored: { id: string; text: string; createdAt: string }[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    cache = stored.map((n) => ({ ...n, createdAt: new Date(n.createdAt) }));
  } catch {
    cache = [];
  }
  return cache;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** メモを新しい順で返し、変更があれば再描画する。 */
export function useNotes(): NotesState {
  const all = useSyncExternalStore(subscribe, read);
  return useMemo(() => ({ notes: sortNewestFirst(all), loading: false, error: null }), [all]);
}

/** メモを追加する。text は整えた後の値（normalizeText）を渡す。保存できなければ例外を投げる。 */
export async function addNote(text: string): Promise<void> {
  const next = [...read(), { id: crypto.randomUUID(), text, createdAt: new Date() }];
  localStorage.setItem(KEY, JSON.stringify(next));
  cache = next;
  listeners.forEach((l) => l());
}
