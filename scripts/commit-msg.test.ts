import { describe, expect, it } from "vite-plus/test";
import { COMMIT_TYPES, checkCommitMessage } from "./commit-msg";

describe("コミットメッセージの検査", () => {
  it.each(COMMIT_TYPES)("種類 %s を通す", (type) => {
    expect(checkCommitMessage(`${type}: 説明`)).toBeNull();
  });

  it.each([
    ["スコープ付き", "fix(e2e): 時計の固定を直す"],
    ["破壊的変更の印", "feat!: データの形を変える"],
    ["スコープと破壊的変更の印", "feat(data)!: データの形を変える"],
    ["本文付き", "docs: README を直す\n\n理由を書いた本文"],
    ["マージ", "Merge branch 'add-stylelint'"],
    ["取り消し", 'Revert "feat: メモの検索を追加"'],
    ["fixup", "fixup! feat: メモの検索を追加"],
    ["先頭のコメント行", "# コメント\n\nfeat: メモの検索を追加"],
  ])("%s を通す", (_name, message) => {
    expect(checkCommitMessage(message)).toBeNull();
  });

  it.each([
    ["プレフィックスなし", "stylelint を導入し、CI に追加"],
    ["未定義の種類", "add: kiso.css"],
    ["大文字の種類", "Feat: メモの検索を追加"],
    ["コロンの後ろにスペースなし", "feat:メモの検索を追加"],
    ["説明が空", "feat: "],
    ["全角のコロン", "feat：メモの検索を追加"],
    ["空のメッセージ", ""],
    ["2行目だけが正しい", "メモの検索を追加\nfeat: メモの検索を追加"],
  ])("%s を弾く", (_name, message) => {
    expect(checkCommitMessage(message)).toContain("<種類>: <説明>");
  });
});
