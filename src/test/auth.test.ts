import { beforeEach, describe, expect, it } from "vitest";
import { sha256Hex } from "@/lib/sha256";
import {
  DEFAULT_ADMIN_PASSWORD,
  changePassword,
  endSession,
  ensureAuthInitialized,
  isAuthenticated,
  isDefaultPasswordActive,
  login,
} from "@/data/auth";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

describe("sha256", () => {
  it("matches published test vectors", () => {
    expect(sha256Hex("")).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    expect(sha256Hex("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
    expect(sha256Hex("abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq")).toBe(
      "248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1",
    );
  });

  it("handles multi-block input", () => {
    const digest = sha256Hex("a".repeat(1000));
    expect(digest).toHaveLength(64);
    expect(digest).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("admin login", () => {
  it("accepts the default password and opens a session", () => {
    ensureAuthInitialized();
    expect(isDefaultPasswordActive()).toBe(true);
    expect(isAuthenticated()).toBe(false);

    const result = login(DEFAULT_ADMIN_PASSWORD);
    expect(result.ok).toBe(true);
    expect(isAuthenticated()).toBe(true);
  });

  it("rejects a wrong password without opening a session", () => {
    const result = login("definitely-wrong");
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("wrong-password");
    expect(isAuthenticated()).toBe(false);
  });

  it("locks out after five failed attempts", () => {
    ensureAuthInitialized();

    for (let attempt = 0; attempt < 5; attempt += 1) {
      expect(login("wrong-password").ok).toBe(false);
    }

    const locked = login(DEFAULT_ADMIN_PASSWORD);
    expect(locked.ok).toBe(false);
    expect(locked.reason).toBe("locked-out");
    expect(locked.remainingMs).toBeGreaterThan(0);
  });
});

describe("password changes", () => {
  it("replaces the default password", () => {
    ensureAuthInitialized();
    expect(login(DEFAULT_ADMIN_PASSWORD).ok).toBe(true);

    const changed = changePassword(DEFAULT_ADMIN_PASSWORD, "a-strong-secret");
    expect(changed.ok).toBe(true);

    endSession();
    expect(login(DEFAULT_ADMIN_PASSWORD).ok).toBe(false);
    expect(login("a-strong-secret").ok).toBe(true);
    expect(isDefaultPasswordActive()).toBe(false);
  });

  it("requires the current password", () => {
    ensureAuthInitialized();
    login(DEFAULT_ADMIN_PASSWORD);

    const changed = changePassword("not-the-current-one", "another-secret");
    expect(changed.ok).toBe(false);
    expect(changed.error).toMatch(/current password/i);
  });

  it("rejects short passwords", () => {
    ensureAuthInitialized();
    login(DEFAULT_ADMIN_PASSWORD);

    const changed = changePassword(DEFAULT_ADMIN_PASSWORD, "abc");
    expect(changed.ok).toBe(false);
    expect(changed.error).toMatch(/at least/i);
  });

  it("refuses to change the password without a session", () => {
    ensureAuthInitialized();
    const changed = changePassword(DEFAULT_ADMIN_PASSWORD, "a-strong-secret");
    expect(changed.ok).toBe(false);
    expect(changed.error).toMatch(/session/i);
  });
});
