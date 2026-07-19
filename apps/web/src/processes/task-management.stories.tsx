import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Task, TaskInput } from "../types/api";
import { DashboardPage } from "../pages/DashboardPage";
import { api } from "../lib/api";
import { expect, userEvent, within } from "storybook/test";

const tasks: Task[] = [
  {
    id: "task-1",
    title: "Preparar la propuesta",
    description: "Reunir referencias y definir alcance.",
    status: "in_progress",
    dueDate: "2026-07-25",
    userId: "user-1",
    createdAt: "2026-07-18T10:00:00.000Z",
    updatedAt: "2026-07-18T10:00:00.000Z",
  },
  {
    id: "task-2",
    title: "Publicar el informe semanal",
    description: null,
    status: "done",
    dueDate: null,
    userId: "user-1",
    createdAt: "2026-07-18T10:00:00.000Z",
    updatedAt: "2026-07-18T10:00:00.000Z",
  },
];

api.defaults.adapter = async (config) => {
  const input = config.data ? (JSON.parse(config.data) as TaskInput) : null;
  const task = input && {
    ...input,
    id:
      config.url?.split("/").at(-1) === "tasks"
        ? "task-new"
        : config.url?.split("/").at(-1),
    userId: "user-1",
    createdAt: "2026-07-18T10:00:00.000Z",
    updatedAt: "2026-07-18T10:00:00.000Z",
  };

  return {
    config,
    data: {
      data:
        config.method === "get"
          ? tasks
          : config.method === "delete"
            ? null
            : task,
    },
    headers: {},
    status: 200,
    statusText: "OK",
  };
};

const meta = {
  title: "Processes/Task Management",
  component: DashboardPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DashboardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Register: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Preparar la propuesta")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Terminada" }));
    await expect(canvas.getByText("Publicar el informe semanal")).toBeVisible();
    await expect(
      canvas.queryByText("Preparar la propuesta"),
    ).not.toBeInTheDocument();
  },
};

export const CreateTask: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Preparar la propuesta")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Nueva tarea" }));
    await userEvent.type(
      canvas.getByLabelText("Título"),
      "Coordinar revisión legal",
    );
    await userEvent.click(
      canvas.getByRole("button", { name: "Guardar ficha" }),
    );
    await expect(canvas.getByText("Coordinar revisión legal")).toBeVisible();
  },
};
