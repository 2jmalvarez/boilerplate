import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./Textarea";

const meta = {
  title: "Design System/UI/Textarea",
  component: Textarea,
  args: { placeholder: "Describe la tarea", rows: 5 },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Invalid: Story = {
  args: { invalid: true, value: "La descripción no es válida." },
};
export const Disabled: Story = {
  args: { disabled: true, value: "No editable" },
};
