import { useState } from "react";
import { Header } from "@/components/Header";
import { useToast } from "@/components/Toast";
import { addNote, useNotes } from "@/data/notes";
import { formatDateTime } from "@/lib/date";
import { normalizeText } from "@/lib/notes";

/** 例の画面：メモの一覧と追加。作るアプリの最初の画面に置き換える。 */
export function Home() {
  const { notes } = useNotes();
  const toast = useToast();
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const value = normalizeText(text);

  const save = async () => {
    setSaving(true);
    try {
      await addNote(value);
      setText("");
      toast("追加しました");
    } catch {
      toast("保存できませんでした。もう一度お試しください");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="screen">
      <Header title="メモ" />
      <main className="body">
        {notes.length === 0 ? (
          <p className="empty">メモはまだありません</p>
        ) : (
          <ul className="list">
            {notes.map((n) => (
              <li key={n.id} className="row">
                <span className="row__text">{n.text}</span>
                <time className="row__time" dateTime={n.createdAt.toISOString()}>
                  {formatDateTime(n.createdAt)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </main>
      <form
        className="bar"
        onSubmit={(e) => {
          e.preventDefault();
          void save();
        }}
      >
        <label className="srOnly" htmlFor="note-text">
          メモ
        </label>
        <input
          id="note-text"
          className="field"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="メモを書く"
          autoComplete="off"
        />
        <button type="submit" className="btn btn--pri" disabled={value === "" || saving}>
          追加
        </button>
      </form>
    </div>
  );
}
