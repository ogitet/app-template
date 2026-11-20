// 例の題材（メモ）の画面で、要素を探す関数。CSS クラスに依存するので、作るアプリに合わせて書き換える。
import type { Locator, Page } from "@playwright/test";

/** 下端の操作バーにある、メモの入力欄。ラベルで探す（id は実行時に作られる）。 */
export const noteInput = (page: Page): Locator => page.getByLabel("メモ", { exact: true });
/** 操作の結果を知らせるトースト。 */
export const toast = (page: Page): Locator => page.locator(".toast");
/** 下端の操作バーにある主ボタン（追加・保存）。 */
export const saveButton = (page: Page): Locator => page.locator(".bar .btn.btn--pri");
