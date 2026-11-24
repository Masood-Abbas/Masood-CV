// ============================================================
//  PORTFOLIO CONTENT TYPES
//  Single source of truth for the shape of every editable
//  section on the site. The admin portal edits exactly this.
// ============================================================

export interface LinkItem {
  icon: string; // icon name — see src/data/icons.tsx
  label: string;
  href: string;
}

export interface ContactItem {
  icon: string;
  label: string;
  value: string;
  href: string; // "" renders as plain text instead of a link
}

export interface AboutDetail {
  icon: string;
  label: string;
  value: string;
}

export interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  responsibilities: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
}

export interface ProjectItem {
  title: string;
  category: string;
  description: string;
  features: string[];
  technologies: string[];
  github: string;
  githubFrontend: string;
  githubBackend: string;
}

export interface SkillCategoryItem {
  title: string;
  icon: string;
  skills: string[];
}

export interface SectionHeading {
  title: string;
  subtitle: string;
}

export interface SiteInfo {
  firstName: string;
  lastName: string;
  cvPath: string;
  siteTitle: string;
  metaDescription: string;
}

export interface HeroInfo {
  badge: string;
  showBadge: boolean;
  name: string;
  description: string;
  techTags: string[];
  showTechTags: boolean;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
  showSecondaryCta: boolean;
  showSocials: boolean;
}

export interface AboutInfo {
  cardTitle: string;
  educationTitle: string;
  paragraphs: string[];
  details: AboutDetail[];
}

export interface SectionsCopy {
  about: SectionHeading;
  experience: SectionHeading;
  projects: SectionHeading;
  skills: SectionHeading;
  contact: SectionHeading & { intro: string };
}

export interface PortfolioSettings {
  /** Optional form endpoint (e.g. Formspree) used by the contact form. */
  formEndpoint: string;
}

export interface PortfolioData {
  site: SiteInfo;
  hero: HeroInfo;
  sections: SectionsCopy;
  about: AboutInfo;
  education: EducationItem[];
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  skillCategories: SkillCategoryItem[];
  socialLinks: LinkItem[];
  contactInfo: ContactItem[];
  settings: PortfolioSettings;
}

/** Every top-level list that the admin can add to / remove from. */
export type EntityListKey =
  | "education"
  | "experiences"
  | "projects"
  | "skillCategories"
  | "socialLinks"
  | "contactInfo";
