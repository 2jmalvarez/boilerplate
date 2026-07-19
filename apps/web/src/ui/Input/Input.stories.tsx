import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta = {
  title: "Design System/UI/Input",
  component: Input,
  args: { placeholder: "nombre@ejemplo.com", type: "email" },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Invalid: Story = { args: { invalid: true, value: "correo@" } };
export const Disabled: Story = {
  args: { disabled: true, value: "No editable" },
};
