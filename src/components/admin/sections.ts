import {
  Briefcase,
  FolderGit2,
  GraduationCap,
  Home,
  Inbox,
  LayoutDashboard,
  Link2,
  Mail,
  Settings,
  Sparkles,
  User,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type AdminSectionId =
  | "dashboard"
  | "site"
  | "hero"
  | "about"
  | "experience"
  | "projects"
  | "skills"
  | "education"
  | "socials"
  | "contact"
  | "messages"
  | "settings";

export interface AdminSection {
  id: AdminSectionId;
  label: string;
  description: string;
  icon: LucideIcon;
  group: "Overview" | "Content" | "System";
}

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Overview of your portfolio and recent activity.",
    icon: LayoutDashboard,
    group: "Overview",
  },
  {
    id: "site",
    label: "Profile & SEO",
    description: "Your name, CV file and the metadata search engines read.",
    icon: User,
    group: "Content",
  },
  {
    id: "hero",
    label: "Hero",
    description: "The headline, tagline, tags and buttons at the top of the page.",
    icon: Sparkles,
    group: "Content",
  },
  {
    id: "about",
    label: "About & summary",
    description: "Your summary paragraphs and the quick facts beside them.",
    icon: Home,
    group: "Content",
  },
  {
    id: "experience",
    label: "Experience",
    description: "Jobs, roles and the responsibilities you list under each.",
    icon: Briefcase,
    group: "Content",
  },
  {
    id: "projects",
    label: "Projects",
    description: "Portfolio projects, features, technologies and repository links.",
    icon: FolderGit2,
    group: "Content",
  },
  {
    id: "skills",
    label: "Skills",
    description: "Skill groups such as frontend, backend and tooling.",
    icon: Wrench,
    group: "Content",
  },
  {
    id: "education",
    label: "Education",
    description: "Degrees and qualifications shown inside the About section.",
    icon: GraduationCap,
    group: "Content",
  },
  {
    id: "socials",
    label: "Social links",
    description: "GitHub, LinkedIn and any other profile links.",
    icon: Link2,
    group: "Content",
  },
  {
    id: "contact",
    label: "Contact details",
    description: "The email, phone and location cards shown with the form.",
    icon: Mail,
    group: "Content",
  },
  {
    id: "messages",
    label: "Messages",
    description: "Messages sent through the contact form in this browser.",
    icon: Inbox,
    group: "System",
  },
  {
    id: "settings",
    label: "Settings",
    description: "Password, backups, import/export and reset.",
    icon: Settings,
    group: "System",
  },
];

export const sectionGroups = ["Overview", "Content", "System"] as const;

export function findSection(id: AdminSectionId): AdminSection {
  return ADMIN_SECTIONS.find((section) => section.id === id) ?? ADMIN_SECTIONS[0];
}
