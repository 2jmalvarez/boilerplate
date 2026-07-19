import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Modal } from "./Modal";

const meta = {
  title: "Design System/UI/Modal",
  component: Modal,
  args: {
    labelledBy: "modal-title",
    onClose: fn(),
    children: (
      <div className="editor-heading">
        <div>
          <span>Confirmación</span>
          <h2 id="modal-title">Revisa los cambios</h2>
        </div>
      </div>
    ),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
