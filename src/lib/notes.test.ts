import { describe, expect, it } from "vite-plus/test";
import { normalizeText, sortNewestFirst } from "./notes";
import type { Note } from "./types";

describe("normalizeText", () => {
  it("前後の空白を除き、連続する空白を1つにまとめる", () => {
    expect(normalizeText("  牛乳を　 買う \n")).toBe("牛乳を 買う");
  });

  it("空白だけの入力は空文字になる", () => {
    expect(normalizeText(" 　\n")).toBe("");
  });
});

describe("sortNewestFirst", () => {
  const note = (id: string, iso: string): Note => ({ id, text: id, createdAt: new Date(iso) });

  it("新しい順に並べ、元の配列は変えない", () => {
    const notes = [note("a", "2026-11-10T09:00:00+09:00"), note("b", "2026-11-11T09:00:00+09:00")];
    expect(sortNewestFirst(notes).map((n) => n.id)).toEqual(["b", "a"]);
    expect(notes.map((n) => n.id)).toEqual(["a", "b"]);
  });
});
