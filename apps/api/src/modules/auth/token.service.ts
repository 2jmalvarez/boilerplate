import jwt, { type JwtPayload } from "jsonwebtoken";
import { z } from "zod";
import { env } from "../../config/env.js";
import type { AuthenticatedUser } from "../../shared/types.js";

const tokenPayloadSchema = z.object({
  sub: z.uuid(),
  email: z.email(),
  roles: z.array(z.string().min(1)),
  permissions: z.array(z.string().regex(/^[a-z][a-z0-9-]*:[a-z][a-z0-9-]*$/)),
});

export function signAccessToken(user: AuthenticatedUser): string {
  return jwt.sign(
    { email: user.email, roles: user.roles, permissions: user.permissions },
    env.JWT_SECRET,
    {
      algorithm: "HS256",
      audience: env.JWT_AUDIENCE,
      issuer: env.JWT_ISSUER,
      subject: user.id,
      expiresIn: 3_600,
    },
  );
}

export function verifyAccessToken(token: string): AuthenticatedUser {
  const decoded = jwt.verify(token, env.JWT_SECRET, {
    algorithms: ["HS256"],
    audience: env.JWT_AUDIENCE,
    issuer: env.JWT_ISSUER,
  }) as JwtPayload;
  const payload = tokenPayloadSchema.parse(decoded);
  return {
    id: payload.sub,
    email: payload.email,
    roles: payload.roles,
    permissions: payload.permissions,
  };
}
