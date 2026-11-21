import { noteInput, noteTexts, saveButton, toast } from './locators';
import { expect, expectNoA11yViolations, test } from './test';

// 画面ごとに、表示が落ち着いた状態で axe の検査をかける。画面や状態を足したら、ここにも足す

test('ホーム（メモの一覧）にアクセシビリティの違反がない', async ({ page }) => {
  await page.goto('/');
  await expect(noteTexts(page).first()).toBeVisible();
  await expectNoA11yViolations(page);
});

test('トーストを出した状態でも、アクセシビリティの違反がない', async ({ page }) => {
  await page.goto('/');
  await noteInput(page).fill('卵を買う');
  await saveButton(page).click();
  await expect(toast(page)).toBeVisible();
  await expectNoA11yViolations(page);
});
