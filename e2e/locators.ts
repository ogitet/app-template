// 例の題材（メモ）の画面で、要素を探す関数。作るアプリの画面に合わせて書き換える。
// クラス名は CSS Modules で実行時に変わるので使わず、役割（role）・ラベル・文言で探す。
import type { Locator, Page } from '@playwright/test';

/** 画面の見出し（ヘッダーの h1）。 */
export const screenTitle = (page: Page): Locator => page.getByRole('heading', { level: 1 });
/** 一覧の各メモの本文。 */
export const noteTexts = (page: Page): Locator => page.getByRole('listitem').locator('span');
/** 一覧の各メモの作成日時。 */
export const noteTimes = (page: Page): Locator => page.getByRole('listitem').locator('time');
/** 下端の操作バーにある、メモの入力欄。ラベルで探す（id は実行時に作られる）。 */
export const noteInput = (page: Page): Locator => page.getByLabel('メモ', { exact: true });
/** 下端の操作バーにある、メモを追加するボタン。 */
export const saveButton = (page: Page): Locator => page.getByRole('button', { name: '追加' });
/** 操作の結果を知らせるトースト（<output> の暗黙のロールが status）。 */
export const toast = (page: Page): Locator => page.getByRole('status');
