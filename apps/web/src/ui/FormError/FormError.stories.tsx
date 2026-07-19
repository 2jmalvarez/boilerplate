import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormError } from "./FormError";

const meta = {
  title: "Design System/UI/FormError",
  component: FormError,
  args: { children: "No se pudo guardar. Inténtalo de nuevo." },
} satisfies Meta<typeof FormError>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
