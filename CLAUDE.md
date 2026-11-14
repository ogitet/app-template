# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

個人開発用の Web アプリのテンプレート（React 19 + TypeScript + Vite+）。このテンプレートから作ったプロジェクトでは、この段落をアプリの説明に書き換え、下の「テンプレートから始めた直後」の節を消す。コメント・UI・コミットメッセージは日本語。

## テンプレートから始めた直後

- 作るものが決まっていなければ、コードを書く前に `docs/README.md` の進め方で設計を決める（01 Strategy → 02 Scope → 03 Structure → `wireframes.html` で配置と見た目を作る → 04 技術選定）。配置と見た目は文書にせず、`wireframes.html` で実際に作って確かめる。
- 例の題材（メモ）を置き換える。対象は README.md の「このテンプレートから始める」にある。
- `index.html` の `___` で囲んだ箇所（タイトル・説明文・公開先のドメイン `___Domain___`）は未置換の目印。前後の `___` ごと書き換える。`public/` のアイコン・共有画像も仮のものなので差し替える。
- バックエンド、PWA、デプロイは入っていない。Firebase や PWA を足すときは、`ogitet/meal-stool-tracker` の `docs/recipes/` を手本にする。
- アプリ固有の構成が固まったら、この文書の「アーキテクチャ」に追記する。

## コマンド

ツールチェーンは Vite+（`vp`）。lint は oxlint、整形は oxfmt（幅 120）、テストは vitest 互換。Node の版は `.node-version` と `package.json` の `volta.node` の2か所に書き、一致をテストが検証する。

```bash
npm run dev            # :5173
npm run demo           # :5199。例データで全画面を表示（バックエンド不要）
npm run storybook      # :6006
npm run check          # 整形・lint・型チェック（--fix で自動修正）。CI と同じ
npm run markuplint     # HTML・JSX の lint（CI でも走る）
npm test               # 単体テスト（src/**/*.test.ts, scripts/**/*.test.ts）
npx vp test run src/lib/notes.test.ts   # 単一ファイル
npm run test:e2e       # Playwright（demo サーバーを自動起動。PC の Chromium と iPhone 15 の Safari）
npx playwright test e2e/home.spec.ts --project=chromium -g "テスト名"   # 単一の E2E
npm run build          # dist/
```

markuplint は `index.html` と `src/**/*.tsx` が対象。JSX パーサーが TypeScript の JS API を使うため、TypeScript は 6 系に固定している（7 には JS API がない）。

E2E は初回のみ `npx playwright install chromium webkit`。E2E は PR の CI でも走る。

## 運用

- `main` に直接コミット・プッシュしない。作業ブランチ → PR → CI（check・単体テスト・build・E2E）が通ったらユーザーがマージ。
- ワークフローの Actions はコミットの SHA で固定し、`GITHUB_TOKEN` は `contents: read` に絞っている。Actions と npm の更新は Dependabot（`.github/dependabot.yml`）が週次で PR を出す。Vite+（`vite`・`vite-plus`・`setup-vp`）は対象外で、手で版をそろえて上げる。
- コミット時に `.vite-hooks/pre-commit`（`vp staged` → `vp check --fix`）が走り、lint・型エラーがあるとコミットできない。

## コードの約束

- export する関数・フック・部品・型には JSDoc を書く。書くのは、名前と型から読み取れないこと（目的、前提、そうした理由）。
- 名前の言い換えだけのコメントは書かない。ファイル内だけで使う小さな関数は、必要なときだけ書く。

## アーキテクチャ

- **データ層の差し替え（デモモード）**: 画面は `src/data/*` だけに依存する。`mode === "demo"` のとき `src/demo/vite-plugin.ts` が、これらの import を同名の `src/demo/*`（メモリ内実装）に解決し直す。Storybook と E2E もこの仕組みでバックエンドなしに動く。したがって **`src/data/` の公開 API を変えたら `src/demo/` の対応ファイルも同じ形に直す**。`src/data/` にファイルを足したら、プラグインの正規表現にも名前を足す。`src/demo/` 内からの import は差し替え対象外。
- **画面とルーティング**: `src/App.tsx` が `createBrowserRouter`（View Transitions に必要）で `src/screens/*` を配置。純粋なロジックは `src/lib/` にあり、単体テストはここに置く。画面の動きは E2E（`e2e/`）で確かめる。
- **E2E**: `e2e/helpers.ts` の `test` を使う（ブラウザの時計を固定する）。例データはページを開くたびに初期状態へ戻るため、テスト同士は影響しない。
- **Storybook**: ストーリーは対象の隣（`*.stories.tsx`、画面は `src/screens/screens.stories.tsx`）。設定は `.storybook/`。
- **型チェックの設定**: 動く環境ごとに tsconfig を分けている。`tsconfig.app.json` はブラウザで動くコード（`src/`。Node の型は入れない）、`tsconfig.node.json` は Node で動くもの（設定ファイル、`scripts/`、単体テスト、`src/demo/vite-plugin.ts`。DOM の型は入れない）、`tsconfig.storybook.json` はストーリーと `.storybook/preview.tsx`（Storybook の型が Node の型を連れてくるため、アプリから分ける）、`tsconfig.e2e.json` は E2E（テストは Node で動き、`page.evaluate` の中身はブラウザで動くため、Node と DOM の両方の型を入れる）。新しい種類のファイルを足したら、どれかの `include` に入っていることを確かめる。
- **見た目**: `src/styles/global.css` の1ファイル。色・書体・余白は冒頭の変数で決める。
