# AGENTS.md

AI のコーディングエージェント（Claude Code・Codex など）が、このリポジトリで作業するときの指示。CLAUDE.md はこのファイルを読み込むだけにしてある。

個人開発用の Web アプリのテンプレート（React 19 + TypeScript + Vite+）。このテンプレートから作ったプロジェクトでは、この段落をアプリの説明に書き換え、下の「テンプレートから始めた直後」の節を消す。コメント・UI・コミットメッセージは日本語。

## テンプレートから始めた直後

- 作るものが決まっていなければ、コードを書く前に `docs/README.md` の進め方で設計を決める（01 Strategy → 02 Scope → 03 Structure → `wireframes.html` で配置と見た目を作る → 04 技術選定）。配置と見た目は文書にせず、`wireframes.html` で実際に作って確かめる。
- 例の題材（メモ）を置き換える。対象は README.md の「このテンプレートから始める」にある。
- `index.html` の `___` で囲んだ箇所（タイトル・説明文・公開先のドメイン `___Domain___`）は未置換の目印。前後の `___` ごと書き換える。`public/` のアイコン・共有画像も仮のものなので差し替える。
- バックエンド、PWA、デプロイは入っていない。Firebase や PWA を足すときは、`ogitet/meal-stool-tracker` の `docs/recipes/` を手本にする。
- アプリ固有の構成が固まったら、この文書の「アーキテクチャ」に追記する。

## コマンド

ツールチェーンは Vite+（`vp`）。lint は oxlint、整形は oxfmt（幅は既定の 100、シングルクォート、import を並べ替える）、テストは vitest 互換。Node の版は `.node-version` と `package.json` の `volta.node` の2か所に書き、一致をテストが検証する。

```bash
npm run dev            # :5173
npm run demo           # :5199。例データで全画面を表示（バックエンド不要）
npm run storybook      # :6006
npm run check          # 静的検査すべて（下の3つを順に）。CI と同じ
npm run check:code     # 整形の確認・lint（oxlint）・型チェック（vp check）
npm run lint:html      # HTML・JSX の lint（markuplint）
npm run lint:css       # CSS の lint（stylelint）
npm run fix            # 整形と lint の自動修正（stylelint --fix → vp check --fix）。markuplint は自動修正なし
npm test               # 単体テスト（src/**/*.test.ts, scripts/**/*.test.ts）
npx vp test run src/lib/notes.test.ts   # 単一ファイル
npm run test:e2e       # Playwright（demo サーバーを自動起動。PC の Chromium と iPhone 15 の Safari）
npx playwright test e2e/home.spec.ts --project=chromium -g "テスト名"   # 単一の E2E
npm run build          # 型チェック（tsc -b）のあと dist/ に出力
npm run guidelines:update   # コーディング規約の最新版を docs/coding-guidelines/ に取り込む
```

markuplint は `index.html` と `src/**/*.tsx` が対象。JSX パーサーが TypeScript の JS API を使うため、TypeScript は 6 系に固定している（7 には JS API がない）。

stylelint は `src/**/*.css` が対象。ルールは `stylelint-config-standard` と、プロパティの並び順を決める `stylelint-config-recess-order`（設定は `.stylelintrc.json`）。recess-order が stylelint 18 に未対応のため、stylelint は 17 系、`stylelint-config-standard` は 40 系に留めている（Dependabot も `.github/dependabot.yml` の `ignore` でこの2つの major 更新を止めている）。対応したら `ignore` を外し、2つを一緒に上げる。

E2E は初回のみ `npx playwright install chromium webkit`。E2E は PR の CI でも走る。

## 運用

- `main` に直接コミット・プッシュしない。作業ブランチ → PR → CI（check・markuplint・stylelint・単体テスト・build・E2E）が通ったらユーザーがマージ。
- コミットメッセージの1行目は `<種類>: <日本語の説明>`（例: `feat: メモの検索を追加`）。種類は `feat`（機能の追加）・`fix`（不具合の修正）・`docs`（文書だけ）・`style`（動きを変えない整形）・`refactor`（動きを変えない整理）・`test`（テスト）・`build`（ビルド・ツール・依存）・`ci`（CI の設定）・`chore`（どれにも当たらない雑務）。スコープ（`fix(e2e): …`）と破壊的変更の印（`feat!: …`）は任意。`.vite-hooks/commit-msg` が `scripts/commit-msg.ts` で1行目を検査し、形が違うとコミットできない。`Merge`・`Revert`・`fixup!` で始まるものは検査しない。Dependabot のコミットは `build(deps): …`・`ci(deps): …` の形で、説明は英語のまま。
- ワークフローの Actions はコミットの SHA で固定し、`GITHUB_TOKEN` は `contents: read` に絞っている。Actions と npm の更新は Dependabot（`.github/dependabot.yml`）が週次で PR を出す。Vite+（`vite`・`vite-plus`）は対象外で、手で版をそろえて上げる。
- コミット時に `.vite-hooks/pre-commit`（`vp staged --no-concurrent`）が、ステージしたファイルだけに対して走る。`vite.config.ts` の `staged` で、`index.html`・`src/**/*.tsx` に markuplint、`src/**/*.css` に `stylelint --fix`、全ファイルに `vp check --fix` を、この順に1つずつかける（同じファイルを同時に読み書きしないため）。エラーがあるとコミットできない。

## コーディング規約

個人用のコーディング規約（https://ogitet.github.io/coding-guidelines/）に従う。規約の本文は `docs/coding-guidelines/` に写してあり、ここから読む。サイトやその `llms-full.txt` は読まない。約10万字あり、ツールで取得すると要約されて、後半の章のルールが抜け落ちるため。写しは手で直さず、`npm run guidelines:update` で取り込み直す（取り込んだ版は `docs/coding-guidelines/README.md`）。

- 作業の最初に `about/compliance.md`（準拠レベル）・`about/principles.md`（原則）・`about/environment.md`（対応環境）を読む。そのうえで、変更するものに応じて次を読む（パスは `docs/coding-guidelines/` から）。全文を一度に読まない。

  | 変更するもの             | 読むファイル                                                                                                                |
  | :----------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
  | 部品・画面（`.tsx`）     | `tech/react.md`・`tech/typescript.md`・`tech/html.md`・`quality/accessibility.md`・`common/naming.md`・`common/comments.md` |
  | ロジック（`.ts`）        | `tech/typescript.md`・`common/naming.md`・`common/comments.md`                                                              |
  | スタイル（`.css`）       | `tech/css.md`・`quality/accessibility.md`                                                                                   |
  | `index.html`             | `tech/html.md`・`quality/accessibility.md`                                                                                  |
  | 画像                     | `common/images.md`・`quality/performance.md`                                                                                |
  | テスト                   | `quality/testing.md`                                                                                                        |
  | lint・整形・CI の設定    | `common/format-and-lint.md`                                                                                                 |
  | コミット・プルリクエスト | `workflow/git.md`                                                                                                           |

- 準拠レベルが必須・推奨のルールは、依頼で触れていなくても守る。
- 必須のルールから外れるのは、技術的に守れないときだけにする。外れた箇所に `// 規約の例外（ルールの見出し）：理由` の形でコメントを書く。推奨のルールから外れるときは、理由をコメントかプルリクエストに書く。
- 作業の終わりに、必須・推奨のルールから外れた箇所とその理由を報告する。
- このプロジェクトでの例外（規約のルールと異なる決まり）はない。作ったら、ここに「ルールの見出し」：代わりにどうするか。理由、の形で書く。

## コードの約束

- export する関数・フック・部品・型には JSDoc を書く。書くのは、名前と型から読み取れないこと（目的、前提、そうした理由）。
- 名前の言い換えだけのコメントは書かない。ファイル内だけで使う小さな関数は、必要なときだけ書く。
- `src/` 内で親フォルダをさかのぼる import は `@/`（= `src/`）で書く。同じフォルダ内は `./`。エイリアスは `vite.config.ts` の `resolve.alias` と各 tsconfig の `paths` の2か所で定義している。`../` で書くと oxlint（`no-restricted-imports`）がエラーにする。`.storybook/` 内は対象外。
- ファイル名は、部品・画面の `.tsx` は PascalCase（`Header.tsx`）、カスタムフックは `use` で始まるキャメルケース（`useNotes.ts`）、それ以外は kebab-case（`vite-plugin.ts`）。lint では検査しないので、書く側が守る。

## アーキテクチャ

- **データ層の差し替え（デモモード）**: 画面は `src/data/*` だけに依存する。`mode === "demo"` のとき `src/demo/vite-plugin.ts` が、これらの import を同名の `src/demo/*`（メモリ内実装）に解決し直す。Storybook と E2E もこの仕組みでバックエンドなしに動く。したがって **`src/data/` の公開 API を変えたら `src/demo/` の対応ファイルも同じ形に直す**（`src/demo/notes.ts` 末尾の `SameApi` のように型で照合しておくと、ずれたとき型チェックが落ちる）。`src/data/` 直下のファイルはすべて差し替わり、`src/demo/` に同名のファイルがなければデモ・Storybook・E2E はエラーで止まる。`src/demo/` 内からの import は差し替え対象外（型を本物から `import type` できる）。
- **画面とルーティング**: `src/App.tsx` が `createBrowserRouter`（View Transitions に必要）で `src/screens/*` を配置。純粋なロジックは `src/lib/` にあり、単体テストはここに置く。画面の動きは E2E（`e2e/`）で確かめる。
- **E2E**: `e2e/test.ts` の `test` を使う（ブラウザの時計を固定し、ページ内でエラーが出ていないことを各テストの最後に確かめる）。spec が `@playwright/test` の `test` を直接 import すると oxlint（`no-restricted-imports`）がエラーにする。`e2e/test.ts` はどのアプリでもそのまま使える土台、`e2e/locators.ts` は例の題材（メモ）の画面で要素を探す関数で、アプリに合わせて書き換える。アクセシビリティは `e2e/test.ts` の `expectNoA11yViolations`（`@axe-core/playwright`。WCAG 2.2 の A・AA）で検査し、画面や状態ごとの検査を `e2e/a11y.spec.ts` に並べる。画面や状態を足したら、ここにも足す。例データはページを開くたびに初期状態へ戻るため、テスト同士は影響しない。
- **Storybook**: ストーリーは対象の隣（`*.stories.tsx`、画面は `src/screens/screens.stories.tsx`）。設定は `.storybook/`。
- **型チェックの設定**: 動く環境ごとに tsconfig を分けている。`tsconfig.app.json` はブラウザで動くコード（`src/`。Node の型は入れない）、`tsconfig.node.json` は Node で動くもの（設定ファイル、`scripts/`、単体テスト、`src/demo/vite-plugin.ts`。DOM の型は入れない）、`tsconfig.storybook.json` はストーリーと `.storybook/preview.tsx`（Storybook の型が Node の型を連れてくるため、アプリから分ける）、`tsconfig.e2e.json` は E2E（テストは Node で動き、`page.evaluate` の中身はブラウザで動くため、Node と DOM の両方の型を入れる）。新しい種類のファイルを足したら、どれかの `include` に入っていることを確かめる。
- **見た目**: 全体にかかるもの（変数・リセット・要素の見た目・単機能のクラス）は `src/styles/global.css`、部品と画面のスタイルは対象の隣の `*.module.css`（CSS Modules。`import styles from './Home.module.css'` → `className={styles.row}`）。色・書体・余白は `global.css` 冒頭の変数で決める。スタイルはカスケードレイヤーに分ける（層の名前・順・役割は `global.css` 冒頭）。`*.module.css` の中身は `@layer components { … }` で囲む。層の外に書いたスタイルはどの層にも勝ってしまうので、必ずどれかの層に入れる（stylelint が検査する）。層の順は最初に現れた `@layer` で決まるため、`global.css` は `src/main.tsx` と `.storybook/preview.tsx` の最初の import にしておく。CSS Modules のクラス名は実行時に変わるので、E2E は役割・ラベル・文言で要素を探す（`e2e/locators.ts`）。外部の CSS は JS から import せず、このファイルの `@import … layer(…)` で層に入れる（リセットの kiso.css がその例。こちらは stylelint では検出できない）。幅 360px 未満の端末では `src/viewport.ts` が viewport を 360px に固定して全体を縮小表示するため、CSS は 360px 以上を前提に書いてよい（幅は `src/lib/viewport.ts` の `MIN_VIEWPORT_WIDTH`）。
