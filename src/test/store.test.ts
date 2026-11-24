import { beforeEach, describe, expect, it } from "vitest";
import { defaultPortfolio } from "@/data/defaultPortfolio";
import {
  CONTENT_STORAGE_KEY,
  buildDefaultPortfolioSource,
  exportPortfolioJson,
  loadPortfolio,
  normalizeMessages,
  normalizePortfolio,
  parseImportedPortfolio,
  savePortfolio,
} from "@/data/store";

beforeEach(() => {
  localStorage.clear();
});

describe("normalizePortfolio", () => {
  it("fills missing sections from the defaults", () => {
    const result = normalizePortfolio({ site: { firstName: "Ali" } });

    expect(result.site.firstName).toBe("Ali");
    expect(result.site.lastName).toBe(defaultPortfolio.site.lastName);
    expect(result.projects).toHaveLength(defaultPortfolio.projects.length);
    expect(result.sections.contact.intro).toBe(defaultPortfolio.sections.contact.intro);
  });

  it("coerces bad values instead of throwing", () => {
    const result = normalizePortfolio({
      hero: "not-an-object",
      projects: "not-a-list",
      education: [{}, { degree: 5 }],
    });

    expect(result.hero.name).toBe(defaultPortfolio.hero.name);
    expect(result.projects).toEqual(defaultPortfolio.projects);
    expect(result.education).toHaveLength(2);
    expect(result.education[1].degree).toBe("5");
  });

  it("drops blank entries from string lists", () => {
    const result = normalizePortfolio({ hero: { techTags: ["React", "", "   "] } });
    expect(result.hero.techTags).toEqual(["React"]);
  });

  it("survives null and primitive input", () => {
    expect(() => normalizePortfolio(null)).not.toThrow();
    expect(normalizePortfolio(42).site.firstName).toBe(defaultPortfolio.site.firstName);
  });
});

describe("persistence", () => {
  it("round-trips through localStorage", () => {
    const edited = normalizePortfolio(defaultPortfolio);
    edited.hero.name = "Edited Name";
    edited.projects = edited.projects.slice(0, 1);

    expect(savePortfolio(edited)).toBe(true);
    expect(localStorage.getItem(CONTENT_STORAGE_KEY)).toBeTruthy();

    const loaded = loadPortfolio();
    expect(loaded.hero.name).toBe("Edited Name");
    expect(loaded.projects).toHaveLength(1);
  });

  it("falls back to defaults when storage holds junk", () => {
    localStorage.setItem(CONTENT_STORAGE_KEY, "{ not json");
    expect(loadPortfolio().hero.name).toBe(defaultPortfolio.hero.name);
  });
});

describe("import / export", () => {
  it("exports valid JSON", () => {
    const json = exportPortfolioJson(defaultPortfolio);
    expect(() => JSON.parse(json)).not.toThrow();
  });

  it("rejects files that are not JSON", () => {
    const result = parseImportedPortfolio("hello");
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/valid JSON/i);
  });

  it("rejects unrelated JSON objects", () => {
    const result = parseImportedPortfolio(JSON.stringify({ unrelated: true }));
    expect(result.ok).toBe(false);
  });

  it("imports a partial backup and merges defaults", () => {
    const result = parseImportedPortfolio(JSON.stringify({ site: { firstName: "Imported" } }));
    expect(result.ok).toBe(true);
    expect(result.data?.site.firstName).toBe("Imported");
    expect(result.data?.projects.length).toBe(defaultPortfolio.projects.length);
  });

  it("generates a drop-in defaultPortfolio.ts source file", () => {
    const source = buildDefaultPortfolioSource(defaultPortfolio);
    expect(source).toContain('import type { PortfolioData } from "./portfolio-types";');
    expect(source).toContain("export const defaultPortfolio: PortfolioData =");
    expect(source).toContain(defaultPortfolio.site.firstName);
  });
});

describe("normalizeMessages", () => {
  it("keeps only usable messages", () => {
    const messages = normalizeMessages([
      { name: "A", email: "a@example.com", message: "Hello" },
      { name: "B", email: "b@example.com", message: "   " },
      "nonsense",
      null,
    ]);

    expect(messages).toHaveLength(1);
    expect(messages[0].name).toBe("A");
    expect(messages[0].read).toBe(false);
    expect(messages[0].id).toBeTruthy();
  });

  it("returns an empty list for non-arrays", () => {
    expect(normalizeMessages({})).toEqual([]);
    expect(normalizeMessages(null)).toEqual([]);
  });
});
