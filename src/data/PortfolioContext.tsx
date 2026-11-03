import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { defaultPortfolio, type PortfolioData } from "@/data/portfolio";

// Everything is stored in the browser (localStorage) — no database.
const STORAGE_KEY = "portfolio-content-v1";
const PASSWORD_KEY = "portfolio-admin-pass";
const UNLOCK_KEY = "portfolio-admin-unlocked";

export const DEFAULT_ADMIN_PASS = "admin123";

function loadStored(): PortfolioData {
  const base: PortfolioData = JSON.parse(JSON.stringify(defaultPortfolio));
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    const stored = JSON.parse(raw);
    // Stored top-level sections override the defaults; missing ones fall back.
    for (const key of Object.keys(base) as (keyof PortfolioData)[]) {
      if (stored && stored[key] !== undefined && stored[key] !== null) {
        (base as any)[key] = stored[key];
      }
    }
  } catch {
    // corrupted storage — fall back to defaults
  }
  return base;
}

function readStoredRaw(): Partial<PortfolioData> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

interface PortfolioContextValue {
  data: PortfolioData;
  setData: (updater: (prev: PortfolioData) => PortfolioData) => void;
  save: (next: PortfolioData) => void;
  reset: () => void;
  hasChanges: boolean;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export const PortfolioProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setDataState] = useState<PortfolioData>(() => loadStored());
  const [stored, setStored] = useState<Partial<PortfolioData> | null>(() => readStoredRaw());

  const save = useCallback((next: PortfolioData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setStored(JSON.parse(JSON.stringify(next)));
      setDataState(next);
      window.dispatchEvent(new Event("portfolio-saved"));
    } catch {
      // storage full or unavailable — keep the in-memory copy
    }
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStored(null);
    setDataState(JSON.parse(JSON.stringify(defaultPortfolio)));
    window.dispatchEvent(new Event("portfolio-saved"));
  }, []);

  const setData = useCallback((updater: (prev: PortfolioData) => PortfolioData) => {
    setDataState((prev) => updater(prev));
  }, []);

  // Keep multiple tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setDataState(loadStored());
        setStored(readStoredRaw());
      }
    };
    const onSaved = () => {
      setDataState(loadStored());
      setStored(readStoredRaw());
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("portfolio-saved", onSaved);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("portfolio-saved", onSaved);
    };
  }, []);

  const value = useMemo<PortfolioContextValue>(
    () => ({
      data,
      setData,
      save,
      reset,
      hasChanges: JSON.stringify(data) !== JSON.stringify(stored ?? defaultPortfolio),
    }),
    [data, stored, setData, save, reset]
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used inside PortfolioProvider");
  return ctx;
};

// ---------- Simple frontend-only admin gate ----------
export const isUnlocked = () => {
  try {
    return sessionStorage.getItem(UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
};

export const unlock = (pass: string) => {
  const expected = localStorage.getItem(PASSWORD_KEY) || DEFAULT_ADMIN_PASS;
  if (pass !== expected) return false;
  sessionStorage.setItem(UNLOCK_KEY, "1");
  return true;
};

export const lock = () => {
  sessionStorage.removeItem(UNLOCK_KEY);
};

export const setAdminPass = (pass: string) => {
  if (pass.trim().length >= 4) localStorage.setItem(PASSWORD_KEY, pass.trim());
};

export const hasCustomPass = () => Boolean(localStorage.getItem(PASSWORD_KEY));
