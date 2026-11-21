import { AxeBuilder } from '@axe-core/playwright';
import { expect, test as base, type Page } from '@playwright/test';

// テスト内の「現在」。例データは現在を基準に作られる
const NOW = new Date('2026-11-11T13:00:00+09:00');

/**
 * Playwright の test に、すべてのテストに共通する前提を足したもの。spec はこちらを使う。
 * - fixedClock: 実行する時刻や曜日で結果が変わらないよう、ブラウザの時計を固定する。
 * - noPageErrors: ページ内のエラー（例外）を集め、テストの最後に空であることを確かめる。
 */
export const test = base.extend<{ fixedClock: void; noPageErrors: void }>({
  fixedClock: [
    async ({ page }, use) => {
      await page.clock.setFixedTime(NOW);
      await use();
    },
    { auto: true },
  ],
  noPageErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on('pageerror', (e) => errors.push(e.message));
      await use();
      expect(errors).toEqual([]);
    },
    { auto: true },
  ],
});
export { expect };

/**
 * 今のページを axe で検査し、アクセシビリティの違反がないことを確かめる。
 * 規則は WCAG 2.2 の A・AA までに絞る（best-practice などの推奨は含めない）。
 * 失敗したときに読めるよう、違反は「規則の id: 該当する要素」の一覧にして比べる。
 */
export async function expectNoA11yViolations(page: Page): Promise<void> {
  const { violations } = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(
    violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
  ).toEqual([]);
}

/** URL のパスが path になるまで待つ（画面遷移は非同期のため）。 */
export async function expectPath(page: Page, path: string): Promise<void> {
  await expect.poll(() => new URL(page.url()).pathname).toBe(path);
}
