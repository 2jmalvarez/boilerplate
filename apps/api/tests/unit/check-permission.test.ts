import { describe, expect, it, vi } from "vitest";
import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../src/shared/app-error.js";
import { checkPermission } from "../../src/modules/auth/auth.middleware.js";

function createRequest(permissions: string[]): Request {
  return {
    user: {
      id: "76df6a08-2a1e-4ca4-87e4-eb036ea63bc3",
      email: "user@example.com",
      roles: ["editor"],
      permissions,
    },
  } as Request;
}

const response = {} as Response;

describe("checkPermission", () => {
  it("allows a user with any requested permission", () => {
    const nextSpy = vi.fn();
    const next: NextFunction = (error) => {
      nextSpy(error);
    };
    const middleware = checkPermission(["task:update", "task:delete"]);

    middleware(createRequest(["task:update"]), response, next);

    expect(nextSpy).toHaveBeenCalledOnce();
  });

  it("rejects a user without the requested permission", () => {
    const middleware = checkPermission(["task:delete"]);
    const next: NextFunction = () => undefined;

    expect(() =>
      middleware(createRequest(["task:update"]), response, next),
    ).toThrow(new AppError(403, "FORBIDDEN", "Insufficient permissions"));
  });
});
