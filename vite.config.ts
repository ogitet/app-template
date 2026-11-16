import { fileURLToPath } from "node:url";
import { defineConfig, lazyPlugins } from "vite-plus";
import react from "@vitejs/plugin-react";
import { demoData } from "./src/demo/vite-plugin";

export default defineConfig(({ mode }) => ({
  // 整形（oxfmt）。設計書（docs/）は文書なので対象外
  fmt: {
    printWidth: 120,
    singleQuote: false,
    semi: true,
    trailingComma: "all",
    ignorePatterns: ["dist/**", "storybook-static/**", "public/**", "docs/**", "package-lock.json"],
  },
  // lint（oxlint）。型情報を使うルールと型チェックも行う
  lint: {
    ignorePatterns: ["dist/**", "storybook-static/**", "public/**"],
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        // src/ の中を指す ../ を禁じる。src/ の外（../../.storybook/preview）は . で始まるので当たらない
        files: ["src/**/*.{ts,tsx}"],
        rules: {
          "no-restricted-imports": [
            "error",
            { patterns: [{ regex: "^(\\.\\./)+[^.]", message: "親フォルダへの import は @/（= src/）で書く" }] },
          ],
        },
      },
    ],
  },
  // コミット時に、ステージしたファイルだけを整形・修正・lint する（.vite-hooks/pre-commit）
  // markuplint・stylelint の対象は npm run markuplint / stylelint と同じ
  // 同じファイルに複数のパターンが当たるので、pre-commit は --no-concurrent で上から順に1つずつ走らせる。
  // 整形（vp check --fix）を最後に置き、stylelint が直した結果も整形済みにする
  staged: {
    "{index.html,src/**/*.tsx}": "markuplint",
    "src/**/*.css": "stylelint --fix",
    "*": "vp check --fix",
  },
  // vp check・lint・fmt のときはプラグインを読み込まない（設定の評価を軽くする）
  // src/ を @/ で読み込めるようにする。型チェック用に、各 tsconfig の paths にも同じ対応を書いている
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  plugins: lazyPlugins(() => [...(mode === "demo" ? [demoData()] : []), react()]),
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
  },
}));
