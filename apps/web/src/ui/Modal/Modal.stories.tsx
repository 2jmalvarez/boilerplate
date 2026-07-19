import { X } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "../IconButton/IconButton";
import { Modal } from "./Modal";
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
} satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
