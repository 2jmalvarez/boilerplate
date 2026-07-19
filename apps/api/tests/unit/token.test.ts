import { describe, expect, it } from "vitest";
import {
  signAccessToken,
  verifyAccessToken,
} from "../../src/modules/auth/token.service.js";

describe("access tokens", () => {
  it("round-trips an authenticated user", () => {
    const user = {
      id: "76df6a08-2a1e-4ca4-87e4-eb036ea63bc3",
      email: "user@example.com",
      role: "user" as const,
    };

    expect(verifyAccessToken(signAccessToken(user))).toEqual(user);
  });

  it("rejects a token signed with another secret", async () => {
    const { default: jwt } = await import("jsonwebtoken");
    const token = jwt.sign(
      { email: "user@example.com", role: "user" },
      "another-secret-that-is-at-least-32-characters",
      {
        algorithm: "HS256",
        subject: "76df6a08-2a1e-4ca4-87e4-eb036ea63bc3",
        issuer: process.env.JWT_ISSUER,
        audience: process.env.JWT_AUDIENCE,
        expiresIn: 60,
      },
    );

    expect(() => verifyAccessToken(token)).toThrow();
  });
});
