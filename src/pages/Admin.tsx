import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink, Lock, Menu, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { endSession, isAuthenticated, refreshSession } from "@/data/auth";
import { usePortfolio } from "@/data/PortfolioContext";
import AdminLogin from "./AdminLogin";
import {
  ADMIN_SECTIONS,
  findSection,
  sectionGroups,
  type AdminSectionId,
} from "@/components/admin/sections";
import {
  AboutPanel,
  ContactPanel,
  EducationPanel,
  ExperiencePanel,
  HeroPanel,
  ProjectsPanel,
  SitePanel,
  SkillsPanel,
  SocialsPanel,
} from "@/components/admin/panels/ContentPanels";
import { DashboardPanel, MessagesPanel, SettingsPanel } from "@/components/admin/panels/SystemPanels";

const isSectionId = (value: string): value is AdminSectionId =>
  ADMIN_SECTIONS.some((section) => section.id === value);

const readSectionFromHash = (): AdminSectionId => {
  const hash = window.location.hash.replace(/^#/, "");
  return isSectionId(hash) ? hash : "dashboard";
};

const Admin = () => {
  const { data, messages, storageError } = usePortfolio();
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated());
  const [activeSection, setActiveSection] = useState<AdminSectionId>(() => readSectionFromHash());
  const [navOpen, setNavOpen] = useState(false);

  const section = findSection(activeSection);
  const unreadCount = messages.filter((message) => !message.read).length;

  const navigate = useCallback((id: AdminSectionId) => {
    setActiveSection(id);
    setNavOpen(false);
    window.history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const lock = useCallback(() => {
    endSession();
    setAuthenticated(false);
    setNavOpen(false);
  }, []);

  // Keep the tab title and browser history sensible while inside the panel.
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `Admin · ${data.site.firstName} ${data.site.lastName}`.trim();

    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow";
    document.head.appendChild(robots);

    const onHashChange = () => setActiveSection(readSectionFromHash());
    window.addEventListener("hashchange", onHashChange);

    return () => {
      document.title = previousTitle;
      robots.remove();
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [data.site.firstName, data.site.lastName]);

  // Sign the admin out when the session lapses, and extend it while in use.
  useEffect(() => {
    if (!authenticated) return;

    const interval = window.setInterval(() => {
      if (!isAuthenticated()) setAuthenticated(false);
    }, 20000);

    let lastRefresh = Date.now();
    const onActivity = () => {
      const now = Date.now();
      if (now - lastRefresh > 60000) {
        lastRefresh = now;
        refreshSession();
      }
    };

    window.addEventListener("pointerdown", onActivity);
    window.addEventListener("keydown", onActivity);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("pointerdown", onActivity);
      window.removeEventListener("keydown", onActivity);
    };
  }, [authenticated]);

  const panel = useMemo(() => {
    switch (activeSection) {
      case "site":
        return <SitePanel />;
      case "hero":
        return <HeroPanel />;
      case "about":
        return <AboutPanel />;
      case "experience":
        return <ExperiencePanel />;
      case "projects":
        return <ProjectsPanel />;
      case "skills":
        return <SkillsPanel />;
      case "education":
        return <EducationPanel />;
      case "socials":
        return <SocialsPanel />;
      case "contact":
        return <ContactPanel />;
      case "messages":
        return <MessagesPanel />;
      case "settings":
        return <SettingsPanel />;
      default:
        return <DashboardPanel onNavigate={navigate} onLock={lock} />;
    }
  }, [activeSection, navigate, lock]);

  if (!authenticated) {
    return <AdminLogin onSuccess={() => setAuthenticated(true)} />;
  }

  const navList = (
    <nav className="space-y-6">
      {sectionGroups.map((group) => {
        const entries = ADMIN_SECTIONS.filter((entry) => entry.group === group);
        return (
          <div key={group}>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {group}
            </p>
            <div className="space-y-1">
              {entries.map((entry) => {
                const Icon = entry.icon;
                const active = entry.id === activeSection;
                const badge = entry.id === "messages" ? unreadCount : 0;
                return (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => navigate(entry.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                      active
                        ? "bg-primary/15 font-medium text-primary"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{entry.label}</span>
                    {badge > 0 && (
                      <span className="ml-auto rounded-full bg-primary/20 px-2 py-0.5 text-[11px] text-primary">
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <button
            type="button"
            className="rounded-md p-2 text-muted-foreground hover:text-foreground lg:hidden"
            onClick={() => setNavOpen((open) => !open)}
            aria-label={navOpen ? "Close menu" : "Open menu"}
            aria-expanded={navOpen}
          >
            {navOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <a href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <span className="hidden text-sm font-semibold sm:inline">Admin panel</span>
          </a>

          <span className="hidden truncate text-sm text-muted-foreground md:inline">
            {data.site.firstName} {data.site.lastName}
          </span>

          <div className="ml-auto flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">View site</span>
              </Button>
            </a>
            <Button variant="ghost" size="sm" className="gap-2" onClick={lock}>
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Lock</span>
            </Button>
          </div>
        </div>

        {navOpen && (
          <div className="border-t border-border/50 bg-background/95 px-4 py-4 lg:hidden">{navList}</div>
        )}
      </header>

      <div className="mx-auto flex max-w-7xl gap-8 px-4 py-8">
        <aside className="hidden w-60 shrink-0 lg:block">
          <div className="sticky top-24">{navList}</div>
        </aside>

        <main className="min-w-0 flex-1">
          {storageError && (
            <div className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              Your browser refused to save the last change — storage may be full or blocked. Export a backup
              before continuing.
            </div>
          )}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight">{section.label}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{section.description}</p>
          </div>
          {panel}
        </main>
      </div>
    </div>
  );
};

export default Admin;
