import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState, ErrorState, LoadingState } from "./Feedback";

const meta = {
  title: "Design System/UI/Feedback",
  component: LoadingState,
} satisfies Meta<typeof LoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Loading: Story = {};

export const Empty: Story = {
  render: () => <EmptyState filtered={false} />,
};

export const Error: Story = {
  render: () => <ErrorState message="No se pudo cargar el registro." />,
};
