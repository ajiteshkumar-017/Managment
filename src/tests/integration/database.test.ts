import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  connectTestDatabase,
  disconnectTestDatabase,
} from "../setup/testDb";

describe("Test database", () => {
  beforeAll(async () => {
    await connectTestDatabase();
  });

  afterAll(async () => {
    await disconnectTestDatabase();
  });

  it("connects to the test database", async () => {
    expect(true).toBe(true);
  });
});