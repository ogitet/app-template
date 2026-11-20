import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, lazyPlugins } from 'vite-plus';

import { demoData } from './src/demo/vite-plugin';

export default defineConfig(({ mode }) => ({
  // 整形（oxfmt）。設計書（docs/）は文書なので対象外
  fmt: {
    singleQuote: true,
    sortImports: true,
    ignorePatterns: ['dist/**', 'storybook-static/**', 'public/**', 'docs/**', 'package-lock.json'],
  },
  // lint（oxlint）。型情報を使うルールと型チェックも行う
  lint: {
    ignorePatterns: ['dist/**', 'storybook-static/**', 'public/**'],
    plugins: ['typescript', 'unicorn', 'oxc', 'import', 'react', 'jsx-a11y'],
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    categories: { correctness: 'error', suspicious: 'warn' },
    rules: {
      'eslint/eqeqeq': 'error',
      'eslint/no-param-reassign': ['error', { props: true }],
      'eslint/no-throw-literal': 'error',
      'eslint/no-var': 'error',
      'eslint/prefer-const': 'error',
      'import/no-default-export': 'error',
      'import/no-unassigned-import': ['warn', { allow: ['**/*.css'] }],
      'oxc/no-barrel-file': ['error', { threshold: 0 }],
      'react/exhaustive-deps': 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-constructed-context-values': 'error',
      'react/no-array-index-key': 'error',
      'react/no-danger': 'error',
      'react/no-unstable-nested-components': 'error',
      'react/prefer-function-component': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/rules-of-hooks': 'error',
      'typescript/ban-ts-comment': [
        'error',
        { 'ts-ignore': true, 'ts-nocheck': true, 'ts-expect-error': 'allow-with-description' },
      ],
      'typescript/consistent-type-definitions': ['error', 'type'],
      'typescript/consistent-type-imports': 'error',
      'typescript/no-explicit-any': 'error',
      'typescript/no-inferrable-types': 'error',
      'typescript/no-non-null-assertion': 'error',
      'vite-plus/prefer-vite-plus-imports': 'error',
    },
    options: { typeAware: true, typeCheck: true },
    overrides: [
      {
        // 設定ファイルは default export で設定を渡す決まり。Storybook もストーリーと .storybook/ を default export で読む
        files: ['*.config.{js,mjs,ts}', '**/*.stories.tsx', '.storybook/**'],
        rules: { 'import/no-default-export': 'off' },
      },
      {
        // src/ の中を指す ../ を禁じる。src/ の外（../../.storybook/preview）は . で始まるので当たらない
        files: ['src/**/*.{ts,tsx}'],
        rules: {
          'no-restricted-imports': [
            'error',
            {
              patterns: [
                {
                  regex: '^(\\.\\./)+[^.]',
                  message: '親フォルダへの import は @/（= src/）で書く',
                },
              ],
            },
          ],
        },
      },
      {
        // spec は e2e/test.ts の test を使う。直接 import すると、時計の固定とページ内エラーの検査が外れる
        files: ['e2e/**/*.spec.ts'],
        rules: {
          'no-restricted-imports': [
            'error',
            {
              paths: [
                {
                  name: '@playwright/test',
                  importNames: ['test'],
                  message: 'test は ./test から import する',
                },
              ],
            },
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
    '{index.html,src/**/*.tsx}': 'markuplint',
    'src/**/*.css': 'stylelint --fix',
    '*': 'vp check --fix',
  },
  // vp check・lint・fmt のときはプラグインを読み込まない（設定の評価を軽くする）
  // src/ を @/ で読み込めるようにする。型チェック用に、各 tsconfig の paths にも同じ対応を書いている
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  plugins: lazyPlugins(() => [...(mode === 'demo' ? [demoData()] : []), react()]),
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'scripts/**/*.test.ts'],
  },
}));
