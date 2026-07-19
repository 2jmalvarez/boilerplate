import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { Button } from "./Button";

const meta = {
  title: "Design System/UI/Button",
  component: Button,
  args: {
    children: "Guardar cambios",
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: { variant: "primary" },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Guardar cambios" }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const Quiet: Story = {
  args: { children: "Cancelar", variant: "quiet" },
};
