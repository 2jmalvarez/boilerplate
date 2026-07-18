import bcrypt from 'bcryptjs';
import type { AuthenticatedUser } from '../../shared/types.js';
import { AppError } from '../../shared/app-error.js';
import type { LoginInput, RegisterInput } from './auth.schemas.js';
import type { AuthRepository, UserRecord } from './auth.repository.js';
import { signAccessToken } from './token.service.js';

function publicUser(user: UserRecord): Omit<UserRecord, 'passwordHash'> {
  const { passwordHash: _passwordHash, ...safeUser } = user;
  return safeUser;
}

function isUniqueViolation(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === '23505';
}

export class AuthService {
  constructor(private readonly repository: AuthRepository) {}

  async register(input: RegisterInput) {
    const passwordHash = await bcrypt.hash(input.password, 12);
    try {
      const user = await this.repository.create(input.name, input.email, passwordHash);
      return { user: publicUser(user), accessToken: signAccessToken(user) };
    } catch (error) {
      if (isUniqueViolation(error)) {
        throw new AppError(409, 'EMAIL_IN_USE', 'An account with this email already exists');
      }
      throw error;
    }
  }

  async login(input: LoginInput) {
    const user = await this.repository.findByEmail(input.email);
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) {
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }
    return { user: publicUser(user), accessToken: signAccessToken(user) };
  }

  async me(principal: AuthenticatedUser) {
    const user = await this.repository.findById(principal.id);
    if (!user) throw new AppError(401, 'INVALID_TOKEN', 'Token user no longer exists');
    return publicUser(user);
  }
}
