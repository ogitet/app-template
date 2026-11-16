import type { Page } from "@playwright/test";
import { expect, test } from "./helpers";

const BASE = "width=device-width, initial-scale=1, viewport-fit=cover";

const viewportMeta = (page: Page) => page.locator('meta[name="viewport"]');

/**
 * `window.outerWidth` を、テストから変えられる値に差し替える。
 * 端末の幅そのものは Playwright から変えられないため、判定に使う値だけを置き換える。
 */
async function mockOuterWidth(page: Page, width: number): Promise<void> {
  await page.addInitScript((initial) => {
    let current = initial;
    Object.defineProperty(window, "outerWidth", { get: () => current, configurable: true });
    Object.assign(window, {
      setOuterWidth: (next: number) => {
        current = next;
        window.dispatchEvent(new Event("resize"));
      },
    });
  }, width);
}

test("幅が 360px 未満の端末では viewport を 360px に固定する", async ({ page }) => {
  await mockOuterWidth(page, 320);
  await page.goto("/");
  await expect(viewportMeta(page)).toHaveAttribute("content", "width=360, viewport-fit=cover");
});

test("幅が広がると元の viewport に戻り、狭まるとまた固定する", async ({ page }) => {
  await mockOuterWidth(page, 320);
  await page.goto("/");
  await expect(viewportMeta(page)).toHaveAttribute("content", "width=360, viewport-fit=cover");

  await page.evaluate(() => (window as unknown as { setOuterWidth: (n: number) => void }).setOuterWidth(400));
  await expect(viewportMeta(page)).toHaveAttribute("content", BASE);

  await page.evaluate(() => (window as unknown as { setOuterWidth: (n: number) => void }).setOuterWidth(280));
  await expect(viewportMeta(page)).toHaveAttribute("content", "width=360, viewport-fit=cover");
});

test("幅が 360px 以上の端末では viewport を変えない", async ({ page }) => {
  await mockOuterWidth(page, 360);
  await page.goto("/");
  await expect(viewportMeta(page)).toHaveAttribute("content", BASE);
});
