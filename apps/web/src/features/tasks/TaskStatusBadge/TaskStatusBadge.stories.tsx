import type { Meta, StoryObj } from "@storybook/react-vite";
import { TaskStatusBadge } from "./TaskStatusBadge";
const meta = {
  title: "Features/Tasks/TaskStatusBadge",
  component: TaskStatusBadge,
  args: { status: "todo" },
} satisfies Meta<typeof TaskStatusBadge>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Todo: Story = {};
export const InProgress: Story = { args: { status: "in_progress" } };
export const Done: Story = { args: { status: "done" } };
