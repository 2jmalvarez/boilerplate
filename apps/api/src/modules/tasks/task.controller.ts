import type { RequestHandler } from "express";
import { sendData } from "../../shared/http-response.js";
import type {
  CreateTaskInput,
  ListTasksInput,
  UpdateTaskInput,
} from "./task.schemas.js";
import type { TaskService } from "./task.service.js";

export class TaskController {
  constructor(private readonly service: TaskService) {}

  create: RequestHandler = async (req, res) => {
    const data = await this.service.create(
      req.user!,
      req.body as CreateTaskInput,
    );
    sendData(res, data, 201);
  };

  list: RequestHandler = async (req, res) => {
    const data = await this.service.list(
      req.user!,
      req.validatedQuery as ListTasksInput,
    );
    sendData(res, data);
  };

  get: RequestHandler = async (req, res) => {
    const data = await this.service.get(req.user!, req.params.id as string);
    sendData(res, data);
  };

  update: RequestHandler = async (req, res) => {
    const data = await this.service.update(
      req.user!,
      req.params.id as string,
      req.body as UpdateTaskInput,
    );
    sendData(res, data);
  };

  delete: RequestHandler = async (req, res) => {
    await this.service.delete(req.user!, req.params.id as string);
    res.status(204).send();
  };
}
