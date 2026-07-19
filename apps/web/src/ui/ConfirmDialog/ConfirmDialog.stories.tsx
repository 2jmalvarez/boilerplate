import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { ConfirmDialog } from "./ConfirmDialog";

const meta = {
  title: "Design System/UI/ConfirmDialog",
  component: ConfirmDialog,
  parameters: { layout: "fullscreen" },
  args: {
    description: "Esta acción no se puede deshacer.",
    onCancel: fn(),
    onConfirm: fn(),
    title: "¿Eliminar esta tarea?",
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Destructive: Story = {
  args: { confirmLabel: "Eliminar tarea", tone: "danger" },
};
export const Loading: Story = {
  args: { confirmLabel: "Eliminando", loading: true, tone: "danger" },
};
