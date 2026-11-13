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
  },
  // コミット時に、ステージしたファイルだけを整形・修正する（.vite-hooks/pre-commit）
  staged: {
    "*": "vp check --fix",
  },
  // vp check・lint・fmt のときはプラグインを読み込まない（設定の評価を軽くする）
  plugins: lazyPlugins(() => [...(mode === "demo" ? [demoData()] : []), react()]),
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
  },
}));
