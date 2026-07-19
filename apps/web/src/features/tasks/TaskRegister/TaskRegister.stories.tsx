import type { Meta, StoryObj } from "@storybook/react-vite";
import { TaskRegister } from "./TaskRegister";
const meta = { title: "Features/Tasks/TaskRegister", component: TaskRegister, args: { loading: false, error: "", tasks: [], emptyTitle: "El registro está limpio.", emptyDescription: "Crea la primera tarea para empezar.", onEdit: () => undefined, onDelete: async () => undefined, onRetry: async () => undefined } } satisfies Meta<typeof TaskRegister>;
export default meta; type Story = StoryObj<typeof meta>;
export const Empty: Story = {}; export const Loading: Story = { args: { loading: true } }; export const Error: Story = { args: { error: "No se pudieron cargar las tareas." } };
