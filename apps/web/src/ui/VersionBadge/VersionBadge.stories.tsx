import type { Meta, StoryObj } from "@storybook/react-vite";
import { VersionBadge } from "./VersionBadge";

const meta = {
  title: "Design System/UI/VersionBadge",
  component: VersionBadge,
  args: { version: "1.0.3" },
} satisfies Meta<typeof VersionBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
