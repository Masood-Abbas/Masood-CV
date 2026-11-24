import "@testing-library/jest-dom";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// jsdom defines window.scrollTo but throws "Not implemented".
Object.defineProperty(window, "scrollTo", { value: () => {}, writable: true, configurable: true });

// framer-motion's `whileInView` needs IntersectionObserver, which jsdom lacks.
if (!("IntersectionObserver" in globalThis)) {
  class MockIntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  Object.defineProperty(globalThis, "IntersectionObserver", {
    value: MockIntersectionObserver,
    configurable: true,
    writable: true,
  });
}

// Node 26 ships a `localStorage` global that is unavailable without a flag and
// shadows jsdom's implementation, so provide a small in-memory Storage for tests.
function createMemoryStorage(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key: string) => (store.has(key) ? (store.get(key) as string) : null),
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    removeItem: (key: string) => {
      store.delete(key);
    },
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
  } as Storage;
}

for (const name of ["localStorage", "sessionStorage"] as const) {
  const existing = (window as unknown as Record<string, unknown>)[name];
  if (!existing) {
    const storage = createMemoryStorage();
    Object.defineProperty(window, name, { value: storage, configurable: true, writable: true });
    try {
      Object.defineProperty(globalThis, name, { value: storage, configurable: true, writable: true });
    } catch {
      // Global is locked down; window storage is enough for jsdom tests.
    }
  }
}
