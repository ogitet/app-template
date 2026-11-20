import { noteInput, noteTexts, noteTimes, saveButton, screenTitle, toast } from './locators';
import { expect, expectPath, test } from './test';

test('例データのメモが新しい順に並ぶ', async ({ page }) => {
  await page.goto('/');
  await expect(noteTexts(page)).toHaveText(['牛乳を買う', '図書館に本を返す', '歯医者の予約']);
  // 時計を固定しているため、1時間前の時刻は決まった値になる
  await expect(noteTimes(page).first()).toHaveText('11/11 12:00');
});

test('メモを追加すると、一覧の先頭に入る', async ({ page }) => {
  await page.goto('/');
  await expect(saveButton(page)).toBeDisabled();

  await noteInput(page).fill('  卵を　買う ');
  await saveButton(page).click();

  await expect(toast(page)).toHaveText('追加しました');
  await expect(noteTexts(page).first()).toHaveText('卵を 買う');
  await expect(noteInput(page)).toHaveValue('');
});

test('空白だけの入力では追加できない', async ({ page }) => {
  await page.goto('/');
  await noteInput(page).fill('   ');
  await expect(saveButton(page)).toBeDisabled();
});

test('存在しない URL はホームへ戻す', async ({ page }) => {
  await page.goto('/no-such-page');
  await expectPath(page, '/');
  await expect(screenTitle(page)).toHaveText('メモ');
});
