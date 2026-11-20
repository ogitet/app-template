import type { Note } from "./types";

/** 入力の前後の空白を除き、連続する空白を1つにまとめる。 */
export function normalizeText(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

/** 新しい順に並べる（元の配列は変えない）。 */
export function sortNewestFirst(notes: readonly Note[]): Note[] {
  return notes.toSorted((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}
