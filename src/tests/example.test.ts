import { describe, expect, it } from "vitest";
import { isSessionExpired } from "@/lib/attendance/isSessionExpired";

describe("isSessionExpired", () => {
  it("returns false before expiry", () => {
    const expiresAt = new Date("2026-08-25T10:00:00Z");
    const now = new Date("2026-08-25T09:59:00Z");

    expect(isSessionExpired(expiresAt, now)).toBe(false);
  });

  it("returns true after expiry", () => {
    const expiresAt = new Date("2026-08-25T10:00:00Z");
    const now = new Date("2026-08-25T10:01:00Z");

    expect(isSessionExpired(expiresAt, now)).toBe(true);
  });
});