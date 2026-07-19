import { z } from "zod";

const email = z
  .email()
  .max(254)
  .transform((value) => value.toLowerCase());
const password = z
  .string()
  .min(8)
  .refine((value) => Buffer.byteLength(value, "utf8") <= 72, {
    message: "Password must not exceed 72 UTF-8 bytes",
  });

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email,
  password,
});

export const loginSchema = z.object({
  email,
  password: z
    .string()
    .min(1)
    .refine((value) => Buffer.byteLength(value, "utf8") <= 72, {
      message: "Password must not exceed 72 UTF-8 bytes",
    }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
