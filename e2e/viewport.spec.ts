import type { Page } from '@playwright/test';

import { expect, test } from './test';

const BASE = 'width=device-width, initial-scale=1, viewport-fit=cover';
const FIXED = 'width=360, viewport-fit=cover';

const viewportMeta = (page: Page) => page.locator('meta[name="viewport"]');

/**
 * ブラウザの中で `window.outerWidth` を width に差し替え、resize を知らせる。
 * 端末の幅そのものは Playwright から変えられないため、判定に使う値だけを置き換える。
 * ページを開く前は `page.addInitScript`、開いた後は `page.evaluate` に渡す。
 */
const setOuterWidth = (width: number): void => {
  Object.defineProperty(window, 'outerWidth', { value: width, configurable: true });
  window.dispatchEvent(new Event('resize'));
};

test('幅が 360px 未満の端末では viewport を 360px に固定する', async ({ page }) => {
  await page.addInitScript(setOuterWidth, 320);
  await page.goto('/');
  await expect(viewportMeta(page)).toHaveAttribute('content', FIXED);
});

test('幅が広がると元の viewport に戻り、狭まるとまた固定する', async ({ page }) => {
  await page.addInitScript(setOuterWidth, 320);
  await page.goto('/');
  await expect(viewportMeta(page)).toHaveAttribute('content', FIXED);

  await page.evaluate(setOuterWidth, 400);
  await expect(viewportMeta(page)).toHaveAttribute('content', BASE);

  await page.evaluate(setOuterWidth, 280);
  await expect(viewportMeta(page)).toHaveAttribute('content', FIXED);
});

test('幅が 360px 以上の端末では viewport を変えない', async ({ page }) => {
  await page.addInitScript(setOuterWidth, 360);
  await page.goto('/');
  await expect(viewportMeta(page)).toHaveAttribute('content', BASE);
});
