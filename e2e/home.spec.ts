import { collectPageErrors, expect, expectPath, saveButton, test, toast } from "./helpers";

test("例データのメモが新しい順に並ぶ", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto("/");
  await expect(page.locator(".row-text")).toHaveText(["牛乳を買う", "図書館に本を返す", "歯医者の予約"]);
  // 時計を固定しているため、1時間前の時刻は決まった値になる
  await expect(page.locator(".row-time").first()).toHaveText("11/11 12:00");
  expect(errors).toEqual([]);
});

test("メモを追加すると、一覧の先頭に入る", async ({ page }) => {
  const errors = collectPageErrors(page);
  await page.goto("/");
  await expect(saveButton(page)).toBeDisabled();

  await page.locator("#note-text").fill("  卵を　買う ");
  await saveButton(page).click();

  await expect(toast(page)).toHaveText("追加しました");
  await expect(page.locator(".row-text").first()).toHaveText("卵を 買う");
  await expect(page.locator("#note-text")).toHaveValue("");
  expect(errors).toEqual([]);
});

test("空白だけの入力では追加できない", async ({ page }) => {
  await page.goto("/");
  await page.locator("#note-text").fill("   ");
  await expect(saveButton(page)).toBeDisabled();
});

test("存在しない URL はホームへ戻す", async ({ page }) => {
  await page.goto("/no-such-page");
  await expectPath(page, "/");
  await expect(page.locator(".hd-c")).toHaveText("メモ");
});
