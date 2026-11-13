import { expect, test as base, type Locator, type Page } from "@playwright/test";

/**
 * テスト内の「現在」。実行する時刻や曜日で結果が変わらないよう、ブラウザの時計を固定する。
 * （例データは現在を基準に作られるため）
 */
export const NOW = new Date("2026-11-11T13:00:00+09:00");

export const test = base.extend<{ fixedClock: void }>({
  fixedClock: [
    async ({ page }, use) => {
      await page.clock.setFixedTime(NOW);
      await use();
    },
    { auto: true },
  ],
});
export { expect };

/** ページ内のエラー（例外）を集める。テストの最後に空であることを確かめる。 */
export function collectPageErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  return errors;
}

/** 操作の結果を知らせるトースト。 */
export const toast = (page: Page): Locator => page.locator(".toast");
/** 下端の操作バーにある主ボタン（追加・保存）。 */
export const saveButton = (page: Page): Locator => page.locator(".bar .btn.pri");

/** URL のパスが path になるまで待つ（画面遷移は非同期のため）。 */
export async function expectPath(page: Page, path: string): Promise<void> {
  await expect.poll(() => new URL(page.url()).pathname).toBe(path);
}
