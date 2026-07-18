import type { RequestHandler } from 'express';
import { sendData } from '../../shared/http-response.js';
import type { AuthService } from './auth.service.js';
import type { LoginInput, RegisterInput } from './auth.schemas.js';

export class AuthController {
  constructor(private readonly service: AuthService) {}

  register: RequestHandler = async (req, res) => {
    const data = await this.service.register(req.body as RegisterInput);
    sendData(res, data, 201);
  };

  login: RequestHandler = async (req, res) => {
    const data = await this.service.login(req.body as LoginInput);
    sendData(res, data);
  };

  me: RequestHandler = async (req, res) => {
    const data = await this.service.me(req.user!);
    sendData(res, data);
  };
}
