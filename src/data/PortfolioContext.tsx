import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { PortfolioData } from "./portfolio-types";
import {
  CONTENT_STORAGE_KEY,
  MESSAGES_STORAGE_KEY,
  clearPortfolio,
  createMessage,
  defaultPortfolio,
  loadMessages,
  loadPortfolio,
  normalizePortfolio,
  savePortfolio,
  saveMessages,
  type ContactMessage,
} from "./store";

interface PortfolioContextValue {
  /** Current portfolio content (saved edits merged over the defaults). */
  data: PortfolioData;
  /** Applies a change and persists it immediately. */
  update: (updater: (previous: PortfolioData) => PortfolioData) => void;
  /** Replaces the whole document (used by import). */
  replace: (next: PortfolioData) => void;
  /** Restores the bundled default content. */
  reset: () => void;
  /** True when the browser refused to persist the last change. */
  storageError: boolean;
  lastSavedAt: Date | null;

  messages: ContactMessage[];
  addMessage: (input: { name: string; email: string; message: string }) => ContactMessage;
  setMessageRead: (id: string, read: boolean) => void;
  deleteMessage: (id: string) => void;
  clearMessages: () => void;
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null);

export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<PortfolioData>(() => loadPortfolio());
  const [messages, setMessages] = useState<ContactMessage[]>(() => loadMessages());
  const [storageError, setStorageError] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Mirror of `data` so updates can be computed without stale closures.
  const dataRef = useRef(data);
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  const commit = useCallback((next: PortfolioData) => {
    dataRef.current = next;
    setData(next);
    setStorageError(!savePortfolio(next));
    setLastSavedAt(new Date());
  }, []);

  const update = useCallback(
    (updater: (previous: PortfolioData) => PortfolioData) => {
      commit(updater(dataRef.current));
    },
    [commit],
  );

  const replace = useCallback(
    (next: PortfolioData) => {
      commit(normalizePortfolio(next, defaultPortfolio));
    },
    [commit],
  );

  const reset = useCallback(() => {
    clearPortfolio();
    const fresh = normalizePortfolio(defaultPortfolio, defaultPortfolio);
    dataRef.current = fresh;
    setData(fresh);
    setStorageError(false);
    setLastSavedAt(new Date());
  }, []);

  const persistMessages = useCallback((next: ContactMessage[]) => {
    setMessages(next);
    saveMessages(next);
  }, []);

  const addMessage = useCallback(
    (input: { name: string; email: string; message: string }) => {
      const message = createMessage(input);
      persistMessages([message, ...loadMessages()]);
      return message;
    },
    [persistMessages],
  );

  const setMessageRead = useCallback(
    (id: string, read: boolean) => {
      persistMessages(loadMessages().map((message) => (message.id === id ? { ...message, read } : message)));
    },
    [persistMessages],
  );

  const deleteMessage = useCallback(
    (id: string) => {
      persistMessages(loadMessages().filter((message) => message.id !== id));
    },
    [persistMessages],
  );

  const clearMessages = useCallback(() => {
    persistMessages([]);
  }, [persistMessages]);

  // Pick up edits made in another tab or window.
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === null || event.key === CONTENT_STORAGE_KEY) {
        const next = loadPortfolio();
        dataRef.current = next;
        setData(next);
      }
      if (event.key === null || event.key === MESSAGES_STORAGE_KEY) {
        setMessages(loadMessages());
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const value = useMemo<PortfolioContextValue>(
    () => ({
      data,
      update,
      replace,
      reset,
      storageError,
      lastSavedAt,
      messages,
      addMessage,
      setMessageRead,
      deleteMessage,
      clearMessages,
    }),
    [
      data,
      update,
      replace,
      reset,
      storageError,
      lastSavedAt,
      messages,
      addMessage,
      setMessageRead,
      deleteMessage,
      clearMessages,
    ],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error("usePortfolio must be used inside PortfolioProvider");
  return context;
};
