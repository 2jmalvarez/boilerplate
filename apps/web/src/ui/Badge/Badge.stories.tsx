import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";
const meta = {
  title: "Design System/UI/Badge",
  component: Badge,
  args: { children: "Pendiente" },
} satisfies Meta<typeof Badge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Warning: Story = { args: { tone: "warning" } };
export const Success: Story = {
  args: { children: "Completada", tone: "success" },
};
export const Info: Story = { args: { children: "En curso", tone: "info" } };
