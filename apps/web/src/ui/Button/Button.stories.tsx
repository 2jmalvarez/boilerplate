import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Button } from "./Button";

const meta = { title: "Design System/UI/Button", component: Button, args: { children: "Guardar cambios", onClick: fn() } } satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Primary: Story = { args: { variant: "primary" } };
export const Quiet: Story = { args: { children: "Cancelar", variant: "quiet" } };
export const Danger: Story = { args: { children: "Eliminar", variant: "danger" } };
export const Loading: Story = { args: { loading: true, variant: "primary" } };
