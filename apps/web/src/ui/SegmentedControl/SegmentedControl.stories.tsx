import { useState } from "react"; import type { Meta, StoryObj } from "@storybook/react-vite"; import { SegmentedControl } from "./SegmentedControl";
const options = [{ value: "all", label: "Todas" }, { value: "todo", label: "Pendientes" }, { value: "done", label: "Terminadas" }] as const;
function Example() { const [value, setValue] = useState<(typeof options)[number]["value"]>("all"); return <SegmentedControl aria-label="Filtrar tareas" onChange={setValue} options={options} value={value} />; }
const meta = { title: "Design System/UI/SegmentedControl", component: Example } satisfies Meta<typeof Example>; export default meta; type Story = StoryObj<typeof meta>; export const Default: Story = {};
