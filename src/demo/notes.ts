/**
 * デモモード（`npm run demo`）、Storybook、E2E 用のメモリ内実装。公開 API は src/data/notes.ts と同じ形にする。
 * 例データはページを開くたびに初期状態へ戻る。本番ビルドには含まれない。
 */
import { useMemo, useSyncExternalStore } from 'react';

import type * as dataNotes from '@/data/notes';
import type { NotesState } from '@/data/notes';
import { sortNewestFirst } from '@/lib/notes';
import type { Note } from '@/lib/types';

// 型は本物から取る（src/demo/ 内の import は差し替わらない。import type は実行時には消える）
export type { NotesState };

const listeners = new Set<() => void>();

// ---- 表示確認用の例データ（現在から過去へ） ----
const hoursAgo = (h: number): Date => new Date(Date.now() - h * 60 * 60 * 1000);
let notes: Note[] = [
  { id: 'n1', text: '牛乳を買う', createdAt: hoursAgo(1) },
  { id: 'n2', text: '図書館に本を返す', createdAt: hoursAgo(26) },
  { id: 'n3', text: '歯医者の予約', createdAt: hoursAgo(50) },
];
let seq = notes.length;

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** メモを新しい順で返し、変更があれば再描画する。 */
export function useNotes(): NotesState {
  const all = useSyncExternalStore(subscribe, () => notes);
  return useMemo(() => ({ notes: sortNewestFirst(all), loading: false, error: null }), [all]);
}

/** メモを追加する。text は整えた後の値（normalizeText）を渡す。保存できなければ例外を投げる。 */
export async function addNote(text: string): Promise<void> {
  seq += 1;
  notes = [...notes, { id: `n${seq}`, text, createdAt: new Date() }];
  listeners.forEach((l) => l());
}

type SameApi<T extends typeof dataNotes> = T;
/** src/data/notes.ts と同じ公開 API を持つことを、型チェックで保証する（ずれると型エラーになる）。 */
export type DemoNotesApi = SameApi<{ useNotes: typeof useNotes; addNote: typeof addNote }>;
