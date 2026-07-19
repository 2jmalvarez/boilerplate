import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TaskRow } from "./TaskRow";
const meta = {
  title: "Features/Tasks/TaskRow",
  component: TaskRow,
  args: {
    index: 0,
    onEdit: fn(),
    onDelete: async () => undefined,
    task: {
      id: "task-1",
      userId: "user-1",
      title: "Preparar la propuesta",
      description: "Reunir referencias y definir alcance.",
      status: "in_progress",
      dueDate: "2026-07-25",
      createdAt: "2026-07-18T10:00:00.000Z",
      updatedAt: "2026-07-18T10:00:00.000Z",
    },
  },
} satisfies Meta<typeof TaskRow>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Completed: Story = {
  args: { task: { ...meta.args.task, status: "done" } },
};
