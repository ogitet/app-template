import type { Meta, StoryObj } from "@storybook/react-vite";
import { Header } from "./Header";

const meta = {
  title: "部品/ヘッダー",
  component: Header,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Header>;
export default meta;
type Story = StoryObj<typeof meta>;

export const TitleOnly: Story = { args: { title: "メモ" } };

export const WithActions: Story = {
  args: {
    left: (
      <button type="button" className="lnk">
        ‹ 戻る
      </button>
    ),
    title: "メモの編集",
    right: (
      <button type="button" className="lnk">
        削除
      </button>
    ),
  },
};
