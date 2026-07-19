import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { expect, fn, userEvent, within } from "storybook/test";
import { AuthScreen } from "../components/AuthScreen";

const meta = {
  title: "Processes/Authentication",
  component: AuthScreen,
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof AuthScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Login: Story = {
  args: {
    mode: "login",
    footer: <p>Primera vez? Crear una cuenta</p>,
    onSubmit: fn(async () => undefined),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Correo electrónico"), "ana@pliego.test");
    await userEvent.type(canvas.getByLabelText("Contraseña"), "secreto123");
    await userEvent.click(canvas.getByRole("button", { name: "Entrar" }));
    await expect(args.onSubmit).toHaveBeenCalledWith({
      name: "",
      email: "ana@pliego.test",
      password: "secreto123",
    });
  },
};

export const Registration: Story = {
  args: {
    mode: "register",
    footer: <p>Ya tienes acceso? Iniciar sesión</p>,
    onSubmit: fn(async () => undefined),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByLabelText("Nombre"), "Ana López");
    await userEvent.type(canvas.getByLabelText("Correo electrónico"), "ana@pliego.test");
    await userEvent.type(canvas.getByLabelText("Contraseña"), "secreto123");
    await userEvent.click(canvas.getByRole("button", { name: "Crear cuenta" }));
    await expect(args.onSubmit).toHaveBeenCalledWith({
      name: "Ana López",
      email: "ana@pliego.test",
      password: "secreto123",
    });
  },
};
