import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { RateLimiter } from "../../server/rateLimiter.js";

describe("RateLimiter", () => {
  let rateLimiter;
  const LIMIT = 3;
  const TIME_WINDOW = 100; // 100ms for fast testing

  beforeEach(() => {
    rateLimiter = new RateLimiter(LIMIT, TIME_WINDOW);
  });

  it("should allow requests under the limit", () => {
    const clientId = "client1";
    expect(rateLimiter.check(clientId)).toBe(true);
    expect(rateLimiter.check(clientId)).toBe(true);
    expect(rateLimiter.check(clientId)).toBe(true);
  });

  it("should block requests over the limit", () => {
    const clientId = "client2";
    // Consume limit
    for (let i = 0; i < LIMIT; i++) {
      rateLimiter.check(clientId);
    }
    // Next one should fail
    expect(rateLimiter.check(clientId)).toBe(false);
  });

  it("should reset count after time window", async () => {
    const clientId = "client3";
    // Consume limit
    for (let i = 0; i < LIMIT; i++) {
      rateLimiter.check(clientId);
    }
    expect(rateLimiter.check(clientId)).toBe(false);

    // Wait for window to pass
    await new Promise((resolve) => setTimeout(resolve, TIME_WINDOW + 10));

    // Should be allowed again
    expect(rateLimiter.check(clientId)).toBe(true);
  });

  it("should handle multiple clients independently", () => {
    const clientA = "A";
    const clientB = "B";

    // Consume limit for A
    for (let i = 0; i < LIMIT; i++) {
      rateLimiter.check(clientA);
    }
    expect(rateLimiter.check(clientA)).toBe(false);

    // B should still be fresh
    expect(rateLimiter.check(clientB)).toBe(true);
  });

  it("should cleanup client data", () => {
    const clientId = "client4";
    rateLimiter.check(clientId);
    expect(rateLimiter.clients.has(clientId)).toBe(true);

    rateLimiter.cleanup(clientId);
    expect(rateLimiter.clients.has(clientId)).toBe(false);
  });
});
