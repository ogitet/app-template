import { readFileSync } from 'node:fs';

/**
 * コミットメッセージの1行目に付けられる種類（Conventional Commits）。
 * 使い分けは README.md の「開発の流れ」にある。
 */
export const COMMIT_TYPES = [
  'feat',
  'fix',
  'docs',
  'style',
  'refactor',
  'test',
  'build',
  'ci',
  'chore',
] as const;

// 例: "feat: 説明"、"fix(e2e): 説明"、"feat!: 説明"
const PREFIXED = new RegExp(`^(${COMMIT_TYPES.join('|')})(\\([^)]+\\))?!?: \\S`);

// git が自動で作る1行目は、書き換えさせない
const GENERATED = /^(Merge |Revert |(fixup|squash|amend)! )/;

/**
 * コミットメッセージの1行目が「<種類>: <説明>」の形かを調べる。
 * 問題がなければ null、あれば表示用のエラー文を返す。
 * エディタで書いたメッセージには git のコメント行が混ざるため、`#` で始まる行と空行は飛ばして1行目を探す。
 */
export function checkCommitMessage(message: string): string | null {
  const subject =
    message.split('\n').find((line) => line.trim() !== '' && !line.startsWith('#')) ?? '';
  if (GENERATED.test(subject) || PREFIXED.test(subject)) return null;
  return [
    'コミットメッセージの1行目は「<種類>: <説明>」の形にしてください。',
    `  1行目: ${subject === '' ? '（空）' : subject}`,
    `  種類: ${COMMIT_TYPES.join(' / ')}`,
    '  例: feat: メモの検索を追加',
  ].join('\n');
}

// commit-msg フック（.vite-hooks/commit-msg）から、メッセージのファイルのパスを引数にして呼ばれる。
// テストから import されたときは実行しない。
if (import.meta.main) {
  const path = process.argv[2];
  if (path === undefined) {
    console.error('使い方: node scripts/commit-msg.ts <コミットメッセージのファイル>');
    process.exit(1);
  }
  const error = checkCommitMessage(readFileSync(path, 'utf8'));
  if (error !== null) {
    console.error(error);
    process.exit(1);
  }
}
