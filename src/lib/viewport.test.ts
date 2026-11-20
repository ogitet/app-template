import { describe, expect, it } from 'vite-plus/test';

import { MIN_VIEWPORT_WIDTH, viewportContent } from './viewport';

const BASE = 'width=device-width, initial-scale=1, viewport-fit=cover';

describe('viewportContent', () => {
  it('固定幅より狭い端末では、width を固定幅にして initial-scale を外す', () => {
    expect(viewportContent(BASE, 359)).toBe('width=360, viewport-fit=cover');
    expect(viewportContent(BASE, 280)).toBe('width=360, viewport-fit=cover');
  });

  it('固定幅以上の端末では、元の content のままにする', () => {
    expect(viewportContent(BASE, MIN_VIEWPORT_WIDTH)).toBe(BASE);
    expect(viewportContent(BASE, 361)).toBe(BASE);
  });

  it('幅を取れない（0 の）ときは固定しない', () => {
    expect(viewportContent(BASE, 0)).toBe(BASE);
  });

  it('空白のない書き方の content も扱える', () => {
    expect(viewportContent('width=device-width,initial-scale=1', 320)).toBe('width=360');
  });
});
