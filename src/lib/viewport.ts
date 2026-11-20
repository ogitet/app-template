/** これより狭い端末では、viewport をこの幅に固定して全体を縮小表示する。CSS はこの幅以上を前提に書ける。 */
export const MIN_VIEWPORT_WIDTH = 360;

/**
 * 端末の幅に合わせた meta viewport の content を返す。
 * 幅が MIN_VIEWPORT_WIDTH 未満なら、base の `width` を固定幅に差し替える。
 * `initial-scale` は残すと固定が効かないため外し、それ以外（`viewport-fit` など）は残す。
 *
 * @param base index.html に書いた元の content
 * @param outerWidth `window.outerWidth`。viewport を固定しても値が変わらないため、これで判定する
 *   （`innerWidth` は固定後に固定幅を返す）。値を取れない環境は 0 を返すので、そのときは固定しない
 */
export function viewportContent(base: string, outerWidth: number): string {
  if (outerWidth <= 0 || outerWidth >= MIN_VIEWPORT_WIDTH) return base;
  return base
    .split(',')
    .map((part) => part.trim())
    .filter((part) => !part.startsWith('initial-scale='))
    .map((part) => (part.startsWith('width=') ? `width=${MIN_VIEWPORT_WIDTH}` : part))
    .join(', ');
}
