import { viewportContent } from "./lib/viewport";

/**
 * 幅の狭い端末で viewport を固定幅にし、広がったら元に戻す。描画の前に1回呼ぶ。
 * 回転や折りたたみの開閉で幅が変わるため、resize のたびに判定し直す。
 * 判定は軽く、content を書き換えるのは境をまたいだときだけなので、間引きはしない。
 */
export function fixNarrowViewport(): void {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (!meta) return;
  const base = meta.content;
  const apply = (): void => {
    const content = viewportContent(base, window.outerWidth);
    if (meta.content !== content) meta.content = content;
  };
  apply();
  window.addEventListener("resize", apply);
}
