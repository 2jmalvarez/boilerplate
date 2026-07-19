import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormField } from "./FormField";

const meta = {
  title: "Design System/UI/Form Field",
  component: FormField,
  args: {
    label: "Correo electrónico",
    children: <input name="email" type="email" placeholder="nombre@empresa.com" />,
  },
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
