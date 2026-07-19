import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState, ErrorState, LoadingState } from "./Feedback";
const meta = {
  title: "Design System/UI/Feedback",
  component: EmptyState,
} satisfies Meta<typeof EmptyState>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Empty: Story = {
  args: {
    title: "No hay resultados",
    description: "Prueba con otros filtros.",
  },
};
export const Loading: Story = {
  args: { title: "Cargando resultados" },
  render: () => <LoadingState label="Cargando resultados" />,
};
export const Error: Story = {
  args: { title: "No se pudo cargar la información." },
  render: () => (
    <ErrorState
      message="No se pudo cargar la información."
      onRetry={() => undefined}
    />
  ),
};
