import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';

// 規約の本文は、規約のリポジトリの src/content/docs/ にある Markdown が唯一の正
const REPO = 'ogitet/coding-guidelines';
const SOURCE_DIR = 'src/content/docs/';
const SITE_ORIGIN = 'https://ogitet.github.io';
const SITE_BASE = '/coding-guidelines/';
const OUT_DIR = 'docs/coding-guidelines';

/**
 * リポジトリのファイル一覧から、規約の章のファイルを選び、src/content/docs/ からの相対パスで返す。
 * サイトのトップ（index.mdx）は章の一覧と案内だけなので含めない。
 */
export function selectChapterPaths(repoPaths: readonly string[]): string[] {
  return repoPaths
    .filter((path) => path.startsWith(SOURCE_DIR) && path.endsWith('.md'))
    .map((path) => path.slice(SOURCE_DIR.length))
    .toSorted();
}

/**
 * サイトの絶対パスのリンク（`/coding-guidelines/tech/css/#…`）を書き換える。
 * 取り込んだ章へのリンクは相対パスの .md にし、AI がリンクをたどって手元のファイルを開けるようにする。
 * 章でないもの（llms-full.txt など）は、サイトの URL にする。
 */
export function rewriteLinks(
  markdown: string,
  fromPath: string,
  chapterPaths: ReadonlySet<string>,
): string {
  return markdown.replace(/\]\((\/coding-guidelines\/[^)\s]*)\)/g, (_match, url: string) => {
    const [pathPart = '', hash] = url.slice(SITE_BASE.length).split('#', 2);
    const chapter = `${pathPart.replace(/\/$/, '')}.md`;
    if (!chapterPaths.has(chapter)) return `](${SITE_ORIGIN}${url})`;
    const relative = posix.relative(posix.dirname(fromPath), chapter);
    return `](${relative}${hash === undefined ? '' : `#${hash}`})`;
  });
}

/** 取り込んだ版と出どころを書いた、フォルダの README の中身を作る。 */
export function buildReadme(sha: string, committedAt: string): string {
  return [
    '# コーディング規約（写し）',
    '',
    `[${REPO}](https://github.com/${REPO}) の \`${SOURCE_DIR}\` を写したもの。手で直さず、\`npm run guidelines:update\` で取り込み直す。`,
    '',
    `- コミット: [${sha.slice(0, 7)}](https://github.com/${REPO}/commit/${sha})`,
    `- コミット日時: ${committedAt}`,
    `- サイト: ${SITE_ORIGIN}${SITE_BASE}`,
    '- ライセンス: 文書は CC BY 4.0、コード例は MIT（詳しくは元のリポジトリの LICENSE）',
    '',
  ].join('\n');
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!response.ok) throw new Error(`${url} の取得に失敗しました（${response.status}）`);
  return (await response.json()) as T;
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url} の取得に失敗しました（${response.status}）`);
  return response.text();
}

type Commit = { sha: string; commit: { committer: { date: string } } };
type Tree = { tree: { path: string; type: string }[]; truncated: boolean };

// main の最新コミットの規約を、docs/coding-guidelines/ に書き出す。
// 消えた章が残らないよう、フォルダを作り直す。
// GitHub API は認証なしで1時間に60回まで。ここで使うのは2回で、本文は API ではない raw から取る。
async function main(): Promise<void> {
  const api = `https://api.github.com/repos/${REPO}`;
  const { sha, commit } = await fetchJson<Commit>(`${api}/commits/main`);
  const { tree, truncated } = await fetchJson<Tree>(`${api}/git/trees/${sha}?recursive=1`);
  if (truncated) throw new Error('ファイル一覧が大きすぎて、途中で切れました');

  const chapters = selectChapterPaths(
    tree.filter((entry) => entry.type === 'blob').map((entry) => entry.path),
  );
  const chapterSet = new Set(chapters);
  const contents = await Promise.all(
    chapters.map((path) =>
      fetchText(`https://raw.githubusercontent.com/${REPO}/${sha}/${SOURCE_DIR}${path}`),
    ),
  );

  rmSync(OUT_DIR, { recursive: true, force: true });
  chapters.forEach((path, i) => {
    const outPath = join(OUT_DIR, path);
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, rewriteLinks(contents[i] ?? '', path, chapterSet));
  });
  writeFileSync(join(OUT_DIR, 'README.md'), buildReadme(sha, commit.committer.date));
  console.log(`${chapters.length} ページを ${sha.slice(0, 7)} から取り込みました（${OUT_DIR}/）`);
}

// テストから import されたときは実行しない
if (import.meta.main) {
  await main();
}
