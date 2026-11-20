import type { StorybookConfig } from '@storybook/react-vite';

import { demoData } from '../src/demo/vite-plugin';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: '@storybook/react-vite',
  // バックエンドには接続せず、デモ用の例データ（src/demo）で画面を描画する
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    // アプリの開発サーバー（node_modules/.vite）と依存の事前処理のキャッシュを共有しない
    cacheDir: 'node_modules/.cache/storybook-vite',
    plugins: [demoData(), ...(viteConfig.plugins ?? [])],
  }),
};

export default config;
