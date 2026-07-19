import { Pencil, Trash2 } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "./IconButton";
const meta = { title: "Design System/UI/IconButton", component: IconButton, args: { "aria-label": "Editar", children: <Pencil aria-hidden="true" size={17} /> } } satisfies Meta<typeof IconButton>;
export default meta; type Story = StoryObj<typeof meta>;
export const Default: Story = {}; export const Danger: Story = { args: { "aria-label": "Eliminar", children: <Trash2 aria-hidden="true" size={17} />, variant: "danger" } };
