# app-template

個人開発用の Web アプリのテンプレート。React 19 + TypeScript + Vite+（oxlint、oxfmt、vitest 互換のテスト）、Playwright、Storybook、GitHub Actions の CI が、最初から通る状態で入っている。

バックエンド（Firebase など）、PWA、デプロイは入れていない。Firebase や PWA を足すときは、`ogitet/meal-stool-tracker` の `docs/recipes/` を手本にする。

## このテンプレートから始める

```bash
gh repo create <新しい名前> --template <このリポジトリ> --private --clone
cd <新しい名前>
npm install
npx playwright install chromium webkit   # E2E 用のブラウザ（1回だけ）
```

始めたら、次を置き換える。

1. `package.json` の `name`、`index.html` の `___` で囲んだ箇所、この README と AGENTS.md の冒頭
   - `index.html` の `___` で囲んだ箇所は、タイトル・説明文・公開先のドメイン（`___Domain___`）。`grep -n ___ index.html` で一覧できる。前後の `___` ごと書き換える。
   - アイコンと共有画像は `public/` の `favicon.svg`・`apple-touch-icon.png`(180px)・`og-image.png`(1200×630) を差し替える。
2. 例の題材（メモ）：`src/lib/{types,notes}.ts`、`src/data/notes.ts`、`src/demo/notes.ts`、`src/screens/Home.tsx`、`e2e/home.spec.ts`、ストーリー
3. 設計の文書を `docs/` に書く（進め方は [docs/README.md](docs/README.md)）

## 開発

```bash
npm run dev            # http://localhost:5173
npm run demo           # http://localhost:5199 例データで全画面を表示（バックエンド不要、デザイン確認用）
npm run storybook      # http://localhost:6006 部品と画面のカタログ（例データで表示）
npm run check          # 静的検査すべて（整形・lint・型チェック、HTML と CSS の lint）
npm run fix            # 整形と lint の自動修正
npm test               # 単体テスト（src/**/*.test.ts, scripts/**/*.test.ts）
npm run test:e2e       # 画面の E2E テスト（Playwright。例データの画面を PC の Chromium とスマートフォンの Safari で操作）
npm run test:e2e:ui    # 同上を、操作の様子を見ながら実行
npm run build          # 型チェック（tsc -b）のあと dist/ に出力
```

## 開発の流れ

`main` には直接コミット・プッシュしない。

1. 作業用のブランチを作り、コミットしてプッシュする。コミットのとき、ステージしたファイルが自動で整形・lint される（`.vite-hooks/pre-commit` の `vp staged`。`npm install` で有効になる）。lint や型のエラーがあるとコミットできない。
2. `main` への PR を作る。PR で CI（整形・lint・型、単体テスト、ビルド、E2E テスト）が走る（[ci.yml](.github/workflows/ci.yml)）。
3. CI が通ったことを確かめてマージする。

### コミットメッセージ

1行目は `<種類>: <説明>` の形にする（説明は日本語）。例: `feat: メモの検索を追加`

| 種類       | 使う場面                                                                      |
| ---------- | ----------------------------------------------------------------------------- |
| `feat`     | 機能の追加                                                                    |
| `fix`      | 不具合の修正                                                                  |
| `docs`     | 文書だけの変更                                                                |
| `style`    | 動きを変えない整形（空白・並び順など。画面の見た目を変えるときは feat / fix） |
| `refactor` | 動きを変えないコードの整理                                                    |
| `test`     | テストの追加・修正                                                            |
| `build`    | ビルド・ツール・依存の変更                                                    |
| `ci`       | CI の設定の変更                                                               |
| `chore`    | 上のどれにも当たらない雑務                                                    |

- 範囲を書きたいときは `fix(e2e): …`、互換性のない変更には `feat!: …` のように `!` を付けられる。
- コミットのとき、`.vite-hooks/commit-msg`（`scripts/commit-msg.ts`）が1行目を検査し、形が違うとコミットできない。`Merge`・`Revert`・`fixup!` で始まるものは検査しない。
- Dependabot のコミットは `build(deps): …`・`ci(deps): …` の形になる（説明は英語のまま）。

## データ層とデモモード

画面は `src/data/*` だけに依存する。デモモード（`npm run demo`）、Storybook、E2E では、`src/demo/vite-plugin.ts` がこれらの import を同名の `src/demo/*`（メモリ内実装と例データ）に差し替える。このため、バックエンドが何であっても、画面の確認とテストはバックエンドなしで動く。

`src/data/notes.ts` は仮の実装（localStorage）。バックエンドを決めたら、公開 API の形を保ったまま置き換える。

## Node のバージョン

次の2か所に同じ版を書く。**Node を上げるときは、両方を変える**（ずれると `npm test` が失敗する）。

- `.node-version`：CI（`setup-vp`）が読む
- `package.json` の `volta.node`：手元の Volta が読む（`volta install node@<版>` も実行する）

## 依存の更新

Dependabot が週次で PR を出す（[dependabot.yml](.github/dependabot.yml)）。Vite+（`vite`・`vite-plus`）は対象外で、手で版をそろえて上げる。
