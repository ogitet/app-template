import { existsSync } from 'node:fs';

import type { Plugin } from 'vite-plus';

/**
 * デモモード（`npm run demo`）と Storybook で使う：src/data/* の読み込みを src/demo/* のメモリ内実装に差し替える。
 * バックエンドに接続せず全画面を描画でき、デザインの確認とテストに使う。本番ビルドには影響しない。
 * src/data/ 直下のファイルはすべて差し替える。src/demo/ に同名のファイルがなければ、本物を読まずにエラーで止める。
 */
export function demoData(): Plugin {
  return {
    name: 'demo-data',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      // 依存（node_modules）は src/data を読まないので、解決し直さない
      if (!importer || importer.includes('/src/demo/') || importer.includes('/node_modules/'))
        return null;
      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
      if (!resolved) return null;
      const match = /^(.*)\/src\/data\/([^/]+\.tsx?)$/.exec(resolved.id);
      if (!match) return resolved;
      const demo = `${match[1]}/src/demo/${match[2]}`;
      if (!existsSync(demo)) this.error(`デモ用の実装がありません: ${demo}`);
      return demo;
    },
  };
}
