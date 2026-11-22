import { describe, expect, it } from 'vite-plus/test';

import { rewriteLinks, selectChapterPaths } from './update-guidelines';

describe('章のファイルの選択', () => {
  it('src/content/docs/ の .md だけを、そこからの相対パスで並べて返す', () => {
    expect(
      selectChapterPaths([
        'README.md',
        'src/content/docs/tech/css.md',
        'src/content/docs/index.mdx',
        'src/content/docs/about/compliance.md',
        'src/content.config.ts',
      ]),
    ).toEqual(['about/compliance.md', 'tech/css.md']);
  });
});

describe('リンクの書き換え', () => {
  const chapters = new Set(['tech/css.md', 'tech/html.md', 'quality/accessibility.md']);

  it.each([
    ['同じフォルダの章', '[HTML](/coding-guidelines/tech/html/)', '[HTML](html.md)'],
    [
      '別のフォルダの章',
      '[アクセシビリティ](/coding-guidelines/quality/accessibility/)',
      '[アクセシビリティ](../quality/accessibility.md)',
    ],
    [
      '見出しへのリンク',
      '[詳しく](/coding-guidelines/quality/accessibility/#フォーカスを表示する)',
      '[詳しく](../quality/accessibility.md#フォーカスを表示する)',
    ],
    [
      '章でないファイル',
      '[全文](/coding-guidelines/llms-full.txt)',
      '[全文](https://ogitet.github.io/coding-guidelines/llms-full.txt)',
    ],
    [
      '外部のリンク',
      '[Baseline](https://web.dev/baseline)',
      '[Baseline](https://web.dev/baseline)',
    ],
  ])('%s', (_name, input, expected) => {
    expect(rewriteLinks(input, 'tech/css.md', chapters)).toBe(expected);
  });

  it('1行に複数のリンクがあっても、すべて書き換える', () => {
    expect(
      rewriteLinks(
        '[A](/coding-guidelines/tech/html/) と [B](/coding-guidelines/tech/css/)',
        'tech/css.md',
        chapters,
      ),
    ).toBe('[A](html.md) と [B](css.md)');
  });
});
