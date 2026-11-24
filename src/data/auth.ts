// ============================================================
//  ADMIN AUTHENTICATION
//  A client-side gate for the static portfolio. The password is
//  never stored in plain text: only a salted SHA-256 digest is
//  kept in this browser. The unlocked session lives in
//  sessionStorage and expires automatically.
//
//  Note: this is a local gate, not server-side security. Anyone
//  with access to the browser profile can inspect storage. It
//  keeps casual visitors out of /admin; it cannot protect
//  secrets, so never put anything private in the portfolio data.
// ============================================================

import { sha256Hex } from "@/lib/sha256";

const AUTH_KEY = "portfolio-admin-auth-v1";
const SESSION_KEY = "portfolio-admin-session-v1";
const ATTEMPTS_KEY = "portfolio-admin-attempts-v1";

/** The password used until the owner changes it in Settings. */
export const DEFAULT_ADMIN_PASSWORD = "admin123";

/** How long an unlocked admin session stays valid. */
export const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

const HASH_ROUNDS = 5000;
const MIN_PASSWORD_LENGTH = 6;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60 * 1000;

interface AuthRecord {
  v: 1;
  salt: string;
  hash: string;
  updatedAt: string;
}

const safeStorage = {
  get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* storage unavailable */
    }
  },
  remove(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {
      /* storage unavailable */
    }
  },
};

const sessionStorageSafe = {
  get(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key: string, value: string) {
    try {
      sessionStorage.setItem(key, value);
    } catch {
      /* storage unavailable */
    }
  },
  remove(key: string) {
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* storage unavailable */
    }
  },
};

function randomSalt(): string {
  const bytes = new Uint8Array(16);
  try {
    globalThis.crypto.getRandomValues(bytes);
  } catch {
    for (let i = 0; i < bytes.length; i += 1) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function digestPassword(password: string, salt: string): string {
  let value = `${salt}:${password}`;
  for (let i = 0; i < HASH_ROUNDS; i += 1) {
    value = sha256Hex(`${value}:${salt}:${i}`);
  }
  return value;
}

function readRecord(): AuthRecord | null {
  const raw = safeStorage.get(AUTH_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<AuthRecord>;
    if (typeof parsed.salt !== "string" || typeof parsed.hash !== "string") return null;
    return { v: 1, salt: parsed.salt, hash: parsed.hash, updatedAt: parsed.updatedAt ?? "" };
  } catch {
    return null;
  }
}

function writeRecord(password: string): AuthRecord {
  const record: AuthRecord = {
    v: 1,
    salt: randomSalt(),
    hash: "",
    updatedAt: new Date().toISOString(),
  };
  record.hash = digestPassword(password, record.salt);
  safeStorage.set(AUTH_KEY, JSON.stringify(record));
  return record;
}

/** Creates the first credential record (the default password) if none exists. */
export function ensureAuthInitialized(): void {
  if (!readRecord()) writeRecord(DEFAULT_ADMIN_PASSWORD);
}

/** True once the owner has replaced the default password. */
export function hasCustomPassword(): boolean {
  const record = readRecord();
  if (!record) return false;
  return record.hash !== digestPassword(DEFAULT_ADMIN_PASSWORD, record.salt);
}

export function isDefaultPasswordActive(): boolean {
  const record = readRecord();
  if (!record) return true;
  return record.hash === digestPassword(DEFAULT_ADMIN_PASSWORD, record.salt);
}

// ---------- Attempt throttling ----------

interface AttemptState {
  failures: number;
  lockedUntil: number;
}

function readAttempts(): AttemptState {
  const raw = safeStorage.get(ATTEMPTS_KEY);
  if (!raw) return { failures: 0, lockedUntil: 0 };
  try {
    const parsed = JSON.parse(raw) as Partial<AttemptState>;
    return {
      failures: typeof parsed.failures === "number" ? parsed.failures : 0,
      lockedUntil: typeof parsed.lockedUntil === "number" ? parsed.lockedUntil : 0,
    };
  } catch {
    return { failures: 0, lockedUntil: 0 };
  }
}

function writeAttempts(state: AttemptState) {
  safeStorage.set(ATTEMPTS_KEY, JSON.stringify(state));
}

export interface LoginResult {
  ok: boolean;
  reason?: "wrong-password" | "locked-out";
  remainingMs?: number;
}

/** Verifies a password, applies lockout after repeated failures, and starts a session. */
export function login(password: string): LoginResult {
  const attempts = readAttempts();
  const now = Date.now();

  if (attempts.lockedUntil > now) {
    return { ok: false, reason: "locked-out", remainingMs: attempts.lockedUntil - now };
  }

  ensureAuthInitialized();
  const record = readRecord();
  if (!record) return { ok: false, reason: "wrong-password" };

  const candidate = digestPassword(password, record.salt);
  if (candidate !== record.hash) {
    const failures = attempts.failures + 1;
    writeAttempts({
      failures: failures >= MAX_ATTEMPTS ? 0 : failures,
      lockedUntil: failures >= MAX_ATTEMPTS ? now + LOCKOUT_MS : 0,
    });
    if (failures >= MAX_ATTEMPTS) {
      return { ok: false, reason: "locked-out", remainingMs: LOCKOUT_MS };
    }
    return { ok: false, reason: "wrong-password" };
  }

  writeAttempts({ failures: 0, lockedUntil: 0 });
  startSession();
  return { ok: true };
}

// ---------- Session ----------

interface SessionRecord {
  expiresAt: number;
}

export function startSession(): void {
  const record: SessionRecord = { expiresAt: Date.now() + SESSION_DURATION_MS };
  sessionStorageSafe.set(SESSION_KEY, JSON.stringify(record));
}

export function endSession(): void {
  sessionStorageSafe.remove(SESSION_KEY);
}

export function getSessionRemainingMs(): number {
  const raw = sessionStorageSafe.get(SESSION_KEY);
  if (!raw) return 0;
  try {
    const parsed = JSON.parse(raw) as Partial<SessionRecord>;
    if (typeof parsed.expiresAt !== "number") return 0;
    return Math.max(0, parsed.expiresAt - Date.now());
  } catch {
    return 0;
  }
}

export function isAuthenticated(): boolean {
  const remaining = getSessionRemainingMs();
  if (remaining <= 0) {
    endSession();
    return false;
  }
  return true;
}

/** Extends an active session (called on admin activity). */
export function refreshSession(): void {
  if (isAuthenticated()) startSession();
}

// ---------- Password management ----------

export interface PasswordChangeResult {
  ok: boolean;
  error?: string;
}

export function changePassword(currentPassword: string, nextPassword: string): PasswordChangeResult {
  if (!isAuthenticated()) return { ok: false, error: "Your admin session expired. Please sign in again." };

  ensureAuthInitialized();
  const record = readRecord();
  if (!record || digestPassword(currentPassword, record.salt) !== record.hash) {
    return { ok: false, error: "Current password is incorrect." };
  }
  if (nextPassword.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, error: `New password must be at least ${MIN_PASSWORD_LENGTH} characters.` };
  }
  if (nextPassword === currentPassword) {
    return { ok: false, error: "New password must be different from the current one." };
  }

  writeRecord(nextPassword);
  startSession();
  return { ok: true };
}

export { MIN_PASSWORD_LENGTH };
