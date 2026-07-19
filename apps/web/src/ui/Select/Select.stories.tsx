import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const meta = {
  title: "Design System/UI/Select",
  component: Select,
  args: {
    children: (
      <>
        <option value="todo">Pendiente</option>
        <option value="in_progress">En curso</option>
        <option value="done">Terminada</option>
      </>
    ),
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Invalid: Story = { args: { invalid: true } };
export const Disabled: Story = { args: { disabled: true } };
