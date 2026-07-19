import { describe, expect, it } from "vitest";
import { checkPermission } from "./checkPermission";

function token(payload: object): string {
  const encode = (value: object) =>
    btoa(JSON.stringify(value))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  return `${encode({ alg: "none" })}.${encode(payload)}.`;
}

describe("checkPermission", () => {
  it("accepts an exact permission from a current token", () => {
    expect(
      checkPermission(
        token({ permissions: ["task:update"], exp: Date.now() / 1_000 + 60 }),
        "task:update",
      ),
    ).toBe(true);
  });

  it("rejects missing, expired, and malformed tokens", () => {
    expect(
      checkPermission(
        token({ permissions: ["task:read"], exp: 1 }),
        "task:read",
      ),
    ).toBe(false);
    expect(checkPermission("not-a-token", "task:read")).toBe(false);
    expect(checkPermission(null, "task:read")).toBe(false);
  });
});
