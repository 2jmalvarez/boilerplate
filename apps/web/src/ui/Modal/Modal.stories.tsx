import { X } from "lucide-react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Button/Button";
import { IconButton } from "../IconButton/IconButton";
import { Modal } from "./Modal";
import type { ModalProps } from "./Modal.types";

function ModalExample({ children, ...args }: ModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" variant="primary" onClick={() => setOpen(true)}>
        Abrir diálogo
      </Button>
      {open && <Modal {...args} onClose={() => setOpen(false)}>{children}</Modal>}
    </>
  );
}

const meta = {
  title: "Design System/UI/Modal",
  component: Modal,
  args: {
    labelledBy: "modal-title",
    onClose: () => undefined,
    children: (
      <div className="modal-demo">
        <header>
          <div>
            <span>Confirmación</span>
            <h2 id="modal-title">Revisa los cambios</h2>
          </div>
          <IconButton aria-label="Cerrar">
            <X aria-hidden="true" />
          </IconButton>
        </header>
        <p>Este diálogo conserva el foco y admite cierre con Escape.</p>
      </div>
    ),
  },
  render: (args) => <ModalExample {...args} />,
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
