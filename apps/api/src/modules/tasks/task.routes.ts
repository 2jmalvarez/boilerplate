import { Router } from 'express';
import { authenticate } from '../auth/auth.middleware.js';
import { validate } from '../../middleware/validate.js';
import type { TaskController } from './task.controller.js';
import { createTaskSchema, listTasksSchema, taskParamsSchema, updateTaskSchema } from './task.schemas.js';

export function createTaskRouter(controller: TaskController): Router {
  const router = Router();
  router.use(authenticate);
  router.get('/', validate({ query: listTasksSchema }), controller.list);
  router.post('/', validate({ body: createTaskSchema }), controller.create);
  router.get('/:id', validate({ params: taskParamsSchema }), controller.get);
  router.patch('/:id', validate({ params: taskParamsSchema, body: updateTaskSchema }), controller.update);
  router.delete('/:id', validate({ params: taskParamsSchema }), controller.delete);
  return router;
}
