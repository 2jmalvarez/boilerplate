import { z } from "zod";

export const taskStatuses = ["todo", "in_progress", "done"] as const;
export type TaskStatus = (typeof taskStatuses)[number];

const taskFields = {
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5_000).nullable(),
  status: z.enum(taskStatuses),
  dueDate: z
    .union([
      z.iso.datetime({ offset: true }),
      z.iso.date().transform((value) => `${value}T00:00:00.000Z`),
    ])
    .nullable(),
};

export const createTaskSchema = z.object({
  title: taskFields.title,
  description: taskFields.description.optional().default(null),
  status: taskFields.status.optional().default("todo"),
  dueDate: taskFields.dueDate.optional().default(null),
});

export const updateTaskSchema = z
  .object({
    title: taskFields.title.optional(),
    description: taskFields.description.optional(),
    status: taskFields.status.optional(),
    dueDate: taskFields.dueDate.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required",
  });

export const taskParamsSchema = z.object({ id: z.uuid() });

export const listTasksSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  status: z.enum(taskStatuses).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksInput = z.infer<typeof listTasksSchema>;
