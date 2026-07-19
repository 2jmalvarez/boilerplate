import { SquareCheckBig } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthLayout } from "./AuthLayout";
const meta = {
  title: "Layouts/AuthLayout",
  component: AuthLayout,
  parameters: { layout: "fullscreen" },
  args: {
    brand: (
      <>
        <SquareCheckBig aria-hidden="true" />
        PLIEGO
      </>
    ),
    issueNumber: "ED. 01 / 2026",
    intro: (
      <>
        <p className="eyebrow">Sistema de producción</p>
        <h1>Orden para el trabajo.</h1>
      </>
    ),
    children: <h2>Acceso reservado</h2>,
  },
} satisfies Meta<typeof AuthLayout>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
