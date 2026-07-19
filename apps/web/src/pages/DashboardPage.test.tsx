import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DashboardPage } from "./DashboardPage";
import type { Task } from "../types/api";

const { api } = vi.hoisted(() => ({
  api: {
    delete: vi.fn(),
    get: vi.fn(),
    patch: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("../lib/api", () => ({
  api,
  getErrorMessage: () => "No se pudo completar la operación.",
}));

const task: Task = {
  id: "task-1",
  userId: "user-1",
  title: "Preparar informe mensual",
  description: "Consolidar los indicadores del período.",
  status: "in_progress",
  dueDate: "2026-07-31",
  createdAt: "2026-07-01T10:00:00.000Z",
  updatedAt: "2026-07-01T10:00:00.000Z",
};

describe("DashboardPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it("abre y cierra el modal para crear una tarea", async () => {
    api.get.mockResolvedValue({ data: { data: [] } });
    const user = userEvent.setup();

    render(<DashboardPage />);

    await user.click(await screen.findByRole("button", { name: "Nueva tarea" }));

    expect(screen.getByRole("dialog", { name: "Crear tarea" })).not.toBeNull();
    expect(document.activeElement).toBe(screen.getByLabelText("Título"));

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("abre el modal con los datos existentes para editar", async () => {
    api.get.mockResolvedValue({ data: { data: [task] } });
    const user = userEvent.setup();

    render(<DashboardPage />);

    await user.click(
      await screen.findByRole("button", { name: "Editar Preparar informe mensual" }),
    );

    expect(screen.getByRole("dialog", { name: "Actualizar tarea" })).not.toBeNull();
    expect(screen.getByLabelText("Título")).toHaveProperty("value", task.title);
    expect(screen.getByLabelText("Descripción")).toHaveProperty(
      "value",
      task.description,
    );
    expect(screen.getByLabelText("Estado")).toHaveProperty("value", task.status);
  });

  it("confirma antes de eliminar una tarea", async () => {
    api.get.mockResolvedValue({ data: { data: [task] } });
    api.delete.mockResolvedValue({ data: { data: null } });
    const user = userEvent.setup();

    render(<DashboardPage />);

    await user.click(
      await screen.findByRole("button", { name: "Borrar Preparar informe mensual" }),
    );

    expect(screen.getByRole("dialog", { name: "¿Eliminar esta tarea?" })).not.toBeNull();
    expect(api.delete).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Eliminar tarea" }));

    expect(api.delete).toHaveBeenCalledWith("/tasks/task-1");
  });
});
