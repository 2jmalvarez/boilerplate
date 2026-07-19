import { describe, expect, it } from "vitest";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../../src/modules/tasks/task.schemas.js";

describe("task validation", () => {
  it("applies safe defaults to a new task", () => {
    expect(createTaskSchema.parse({ title: "Ship API" })).toEqual({
      title: "Ship API",
      description: null,
      status: "todo",
      dueDate: null,
    });
  });

  it("rejects empty updates", () => {
    expect(updateTaskSchema.safeParse({}).success).toBe(false);
  });
});
