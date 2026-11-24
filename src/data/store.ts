// ============================================================
//  CONTENT STORAGE
//  Loads, validates and persists portfolio content and the
//  contact-message inbox. Everything lives in this browser's
//  localStorage; every value read back is normalised against
//  the defaults so a partial or corrupt save can never break
//  the site.
// ============================================================

import { defaultPortfolio } from "./defaultPortfolio";
import type {
  AboutDetail,
  ContactItem,
  EducationItem,
  ExperienceItem,
  LinkItem,
  PortfolioData,
  ProjectItem,
  SectionHeading,
  SkillCategoryItem,
} from "./portfolio-types";

export const CONTENT_STORAGE_KEY = "portfolio-content-v2";
export const MESSAGES_STORAGE_KEY = "portfolio-messages-v1";

// ---------- primitive coercion helpers ----------

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const asString = (value: unknown, fallback = ""): string => {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
};

const asBool = (value: unknown, fallback: boolean): boolean =>
  typeof value === "boolean" ? value : fallback;

const asStringList = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => asString(entry)).filter((entry) => entry.trim().length > 0);
};

const mapRecords = <T,>(value: unknown, map: (raw: Record<string, unknown>, index: number) => T): T[] => {
  if (!Array.isArray(value)) return [];
  return value.map((entry, index) => map(isRecord(entry) ? entry : {}, index));
};

const sectionHeading = (value: unknown, fallback: SectionHeading, withIntro = false) => {
  const record = isRecord(value) ? value : {};
  const base = {
    title: asString(record.title, fallback.title),
    subtitle: asString(record.subtitle, fallback.subtitle),
  };
  return withIntro
    ? { ...base, intro: asString(record.intro, (fallback as SectionHeading & { intro: string }).intro) }
    : base;
};

// ---------- section normalisers ----------

const normalizeAboutDetail = (raw: Record<string, unknown>, index: number): AboutDetail => ({
  icon: asString(raw.icon, "Globe"),
  label: asString(raw.label, `Detail ${index + 1}`),
  value: asString(raw.value),
});

const normalizeEducation = (raw: Record<string, unknown>): EducationItem => ({
  degree: asString(raw.degree),
  institution: asString(raw.institution),
  period: asString(raw.period),
});

const normalizeExperience = (raw: Record<string, unknown>): ExperienceItem => ({
  title: asString(raw.title),
  company: asString(raw.company),
  period: asString(raw.period),
  responsibilities: asStringList(raw.responsibilities),
});

const normalizeProject = (raw: Record<string, unknown>): ProjectItem => ({
  title: asString(raw.title),
  category: asString(raw.category),
  description: asString(raw.description),
  features: asStringList(raw.features),
  technologies: asStringList(raw.technologies),
  github: asString(raw.github),
  githubFrontend: asString(raw.githubFrontend),
  githubBackend: asString(raw.githubBackend),
});

const normalizeSkillCategory = (raw: Record<string, unknown>): SkillCategoryItem => ({
  title: asString(raw.title),
  icon: asString(raw.icon, "Code2"),
  skills: asStringList(raw.skills),
});

const normalizeLink = (raw: Record<string, unknown>, index: number): LinkItem => ({
  icon: asString(raw.icon, "Globe"),
  label: asString(raw.label, `Link ${index + 1}`),
  href: asString(raw.href),
});

const normalizeContactItem = (raw: Record<string, unknown>, index: number): ContactItem => ({
  icon: asString(raw.icon, "Mail"),
  label: asString(raw.label, `Item ${index + 1}`),
  value: asString(raw.value),
  href: asString(raw.href),
});

/**
 * Normalises arbitrary input (stored JSON, an imported backup, anything)
 * into a complete PortfolioData tree, falling back per-field to `base`.
 */
export function normalizePortfolio(input: unknown, base: PortfolioData = defaultPortfolio): PortfolioData {
  const root = isRecord(input) ? input : {};
  const site = isRecord(root.site) ? root.site : {};
  const hero = isRecord(root.hero) ? root.hero : {};
  const sections = isRecord(root.sections) ? root.sections : {};
  const about = isRecord(root.about) ? root.about : {};
  const settings = isRecord(root.settings) ? root.settings : {};

  return {
    site: {
      firstName: asString(site.firstName, base.site.firstName),
      lastName: asString(site.lastName, base.site.lastName),
      cvPath: asString(site.cvPath, base.site.cvPath),
      siteTitle: asString(site.siteTitle, base.site.siteTitle),
      metaDescription: asString(site.metaDescription, base.site.metaDescription),
    },
    hero: {
      badge: asString(hero.badge, base.hero.badge),
      showBadge: asBool(hero.showBadge, base.hero.showBadge),
      name: asString(hero.name, base.hero.name),
      description: asString(hero.description, base.hero.description),
      techTags: Array.isArray(hero.techTags) ? asStringList(hero.techTags) : base.hero.techTags,
      showTechTags: asBool(hero.showTechTags, base.hero.showTechTags),
      ctaText: asString(hero.ctaText, base.hero.ctaText),
      ctaHref: asString(hero.ctaHref, base.hero.ctaHref),
      secondaryCtaText: asString(hero.secondaryCtaText, base.hero.secondaryCtaText),
      secondaryCtaHref: asString(hero.secondaryCtaHref, base.hero.secondaryCtaHref),
      showSecondaryCta: asBool(hero.showSecondaryCta, base.hero.showSecondaryCta),
      showSocials: asBool(hero.showSocials, base.hero.showSocials),
    },
    sections: {
      about: sectionHeading(sections.about, base.sections.about),
      experience: sectionHeading(sections.experience, base.sections.experience),
      projects: sectionHeading(sections.projects, base.sections.projects),
      skills: sectionHeading(sections.skills, base.sections.skills),
      contact: sectionHeading(sections.contact, base.sections.contact, true) as PortfolioData["sections"]["contact"],
    },
    about: {
      cardTitle: asString(about.cardTitle, base.about.cardTitle),
      educationTitle: asString(about.educationTitle, base.about.educationTitle),
      paragraphs: Array.isArray(about.paragraphs) ? asStringList(about.paragraphs) : base.about.paragraphs,
      details: Array.isArray(about.details)
        ? mapRecords(about.details, normalizeAboutDetail)
        : base.about.details,
    },
    education: Array.isArray(root.education)
      ? mapRecords(root.education, normalizeEducation)
      : base.education,
    experiences: Array.isArray(root.experiences)
      ? mapRecords(root.experiences, normalizeExperience)
      : base.experiences,
    projects: Array.isArray(root.projects) ? mapRecords(root.projects, normalizeProject) : base.projects,
    skillCategories: Array.isArray(root.skillCategories)
      ? mapRecords(root.skillCategories, normalizeSkillCategory)
      : base.skillCategories,
    socialLinks: Array.isArray(root.socialLinks) ? mapRecords(root.socialLinks, normalizeLink) : base.socialLinks,
    contactInfo: Array.isArray(root.contactInfo)
      ? mapRecords(root.contactInfo, normalizeContactItem)
      : base.contactInfo,
    settings: {
      formEndpoint: asString(settings.formEndpoint, base.settings.formEndpoint),
    },
  };
}

// ---------- portfolio persistence ----------

export function loadPortfolio(): PortfolioData {
  try {
    const raw = localStorage.getItem(CONTENT_STORAGE_KEY);
    if (!raw) return normalizePortfolio(defaultPortfolio, defaultPortfolio);
    return normalizePortfolio(JSON.parse(raw), defaultPortfolio);
  } catch {
    return normalizePortfolio(defaultPortfolio, defaultPortfolio);
  }
}

export function savePortfolio(data: PortfolioData): boolean {
  try {
    localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function clearPortfolio(): void {
  try {
    localStorage.removeItem(CONTENT_STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
}

// ---------- contact inbox ----------

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const makeId = () => {
  try {
    return crypto.randomUUID();
  } catch {
    return `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
};

export function normalizeMessages(input: unknown): ContactMessage[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((entry) => {
      if (!isRecord(entry)) return null;
      const message: ContactMessage = {
        id: asString(entry.id) || makeId(),
        name: asString(entry.name),
        email: asString(entry.email),
        message: asString(entry.message),
        createdAt: asString(entry.createdAt) || new Date().toISOString(),
        read: asBool(entry.read, false),
      };
      return message.message.trim() ? message : null;
    })
    .filter((entry): entry is ContactMessage => entry !== null);
}

export function loadMessages(): ContactMessage[] {
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (!raw) return [];
    return normalizeMessages(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function saveMessages(messages: ContactMessage[]): void {
  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  } catch {
    /* storage unavailable */
  }
}

export function createMessage(input: {
  name: string;
  email: string;
  message: string;
}): ContactMessage {
  return {
    id: makeId(),
    name: input.name,
    email: input.email,
    message: input.message,
    createdAt: new Date().toISOString(),
    read: false,
  };
}

// ---------- import / export ----------

export function exportPortfolioJson(data: PortfolioData): string {
  return JSON.stringify(data, null, 2);
}

/** Generates a drop-in replacement for src/data/defaultPortfolio.ts. */
export function buildDefaultPortfolioSource(data: PortfolioData): string {
  const stamp = new Date().toISOString();
  return [
    "// ============================================================",
    "//  DEFAULT PORTFOLIO CONTENT",
    `//  Generated by the admin portal on ${stamp}`,
    "//  Replace src/data/defaultPortfolio.ts with this file to make",
    "//  these edits part of your published build.",
    "// ============================================================",
    "",
    'import type { PortfolioData } from "./portfolio-types";',
    "",
    `export const defaultPortfolio: PortfolioData = ${JSON.stringify(data, null, 2)};`,
    "",
  ].join("\n");
}

export interface ImportResult {
  ok: boolean;
  data?: PortfolioData;
  error?: string;
}

const PORTFOLIO_KEYS = [
  "site",
  "hero",
  "sections",
  "about",
  "education",
  "experiences",
  "projects",
  "skillCategories",
  "socialLinks",
  "contactInfo",
] as const;

export function parseImportedPortfolio(text: string): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file is not valid JSON." };
  }

  if (!isRecord(parsed)) {
    return { ok: false, error: "That file does not contain portfolio data." };
  }

  const hasKnownKey = PORTFOLIO_KEYS.some((key) => key in parsed);
  if (!hasKnownKey) {
    return { ok: false, error: "That JSON file does not look like a portfolio backup." };
  }

  return { ok: true, data: normalizePortfolio(parsed, defaultPortfolio) };
}

export { defaultPortfolio };
