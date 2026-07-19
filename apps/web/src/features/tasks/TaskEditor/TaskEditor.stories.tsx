import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../../../ui/Button/Button";
import { TaskEditor } from "./TaskEditor";
import type { TaskEditorProps } from "./TaskEditor.types";

function TaskEditorExample(args: TaskEditorProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" variant="primary" onClick={() => setOpen(true)}>
        {args.task ? "Editar tarea" : "Crear tarea"}
      </Button>
      {open && (
        <TaskEditor
          {...args}
          onCancel={() => setOpen(false)}
          onSave={async (input) => {
            await args.onSave(input);
            if (!args.saving) setOpen(false);
          }}
        />
      )}
    </>
  );
}

const meta = {
  title: "Features/Tasks/TaskEditor",
  component: TaskEditor,
  parameters: { layout: "fullscreen" },
  args: {
    task: null,
    saving: false,
    error: "",
    onCancel: () => undefined,
    onSave: async () => undefined,
  },
  render: (args) => <TaskEditorExample {...args} />,
} satisfies Meta<typeof TaskEditor>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Create: Story = {};
export const Saving: Story = { args: { saving: true } };
