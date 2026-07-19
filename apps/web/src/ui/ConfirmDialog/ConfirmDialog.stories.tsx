import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { ConfirmDialog } from "./ConfirmDialog";
import type { ConfirmDialogProps } from "./ConfirmDialog.types";

function ConfirmDialogExample(args: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" variant="danger" onClick={() => setOpen(true)}>
        Abrir confirmación
      </Button>
      {open && (
        <ConfirmDialog
          {...args}
          onCancel={() => setOpen(false)}
          onConfirm={() => {
            args.onConfirm();
            if (!args.loading) setOpen(false);
          }}
        />
      )}
    </>
  );
}

const meta = {
  title: "Design System/UI/ConfirmDialog",
  component: ConfirmDialog,
  parameters: { layout: "fullscreen" },
  args: {
    description: "Esta acción no se puede deshacer.",
    onCancel: () => undefined,
    onConfirm: () => undefined,
    title: "¿Eliminar esta tarea?",
  },
  render: (args) => <ConfirmDialogExample {...args} />,
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Destructive: Story = { args: { confirmLabel: "Eliminar tarea", tone: "danger" } };
export const Loading: Story = { args: { confirmLabel: "Eliminando", loading: true, tone: "danger" } };
