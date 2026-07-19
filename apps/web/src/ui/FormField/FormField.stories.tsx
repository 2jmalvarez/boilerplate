import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormField } from "./FormField";
const meta = {
  title: "Design System/UI/FormField",
  component: FormField,
  args: {
    label: "Correo electrónico",
    children: <input type="email" placeholder="nombre@ejemplo.com" />,
  },
} satisfies Meta<typeof FormField>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithHint: Story = {
  args: { hint: "Usaremos este correo para acceder." },
};
export const WithError: Story = {
  args: { error: "Introduce un correo válido." },
};
