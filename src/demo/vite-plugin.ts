import type { Plugin } from "vite-plus";

/**
 * デモモード（`npm run demo`）と Storybook で使う：src/data/* の読み込みを src/demo/* のメモリ内実装に差し替える。
 * バックエンドに接続せず全画面を描画でき、デザインの確認とテストに使う。本番ビルドには影響しない。
 * src/data/ にファイルを足したら、下の正規表現にも名前を足し、src/demo/ に同じ公開 API の実装を置く。
 */
export function demoData(): Plugin {
  return {
    name: "demo-data",
    enforce: "pre",
    async resolveId(source, importer, options) {
      if (!importer || importer.includes("/src/demo/")) return null;
      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
      if (!resolved) return null;
      if (/\/src\/data\/(notes)\.ts$/.test(resolved.id)) {
        return resolved.id.replace("/src/data/", "/src/demo/");
      }
      return resolved;
    },
  };
}
