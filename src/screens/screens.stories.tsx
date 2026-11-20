import type { Meta, StoryObj } from '@storybook/react-vite';

import type { RouteParameter } from '../../.storybook/preview';
import { Home } from './Home';

/**
 * 画面。デモ用の例データ（src/demo）で表示する。
 * 操作した結果はページを読み直すまで保たれる。ストーリーの外へ遷移すると、行き先の URL を表示する。
 */
const meta = {
  title: '画面',
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const route = (path: string, url: string): { route: RouteParameter } => ({ route: { path, url } });

export const HomeScreen: Story = {
  name: 'ホーム（メモの一覧）',
  render: () => <Home />,
  parameters: route('/', '/'),
};
