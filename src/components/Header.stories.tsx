import type { Meta, StoryObj } from '@storybook/react-vite';

import { Header } from './Header';

import styles from './Header.module.css';

const meta = {
  title: '部品/ヘッダー',
  component: Header,
} satisfies Meta<typeof Header>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = { args: { title: 'メモ' } };

export const WithActions: Story = {
  args: {
    left: (
      <button type="button" className={styles.link}>
        ‹ 戻る
      </button>
    ),
    title: 'メモの編集',
    right: (
      <button type="button" className={styles.link}>
        削除
      </button>
    ),
  },
};
