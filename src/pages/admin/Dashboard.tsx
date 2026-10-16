import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderKanban, Code2, Briefcase, GraduationCap, Award, Wrench,
  MessageSquareQuote, FileText, Mail, Plus, User, Sparkles, ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const db = supabase as any;

const statTables = [
  { label: "Projects", table: "projects", icon: FolderKanban, path: "/admin/projects" },
  { label: "Skills", table: "skills", icon: Code2, path: "/admin/skills" },
  { label: "Experience", table: "experiences", icon: Briefcase, path: "/admin/experience" },
  { label: "Education", table: "education", icon: GraduationCap, path: "/admin/education" },
  { label: "Certifications", table: "certifications", icon: Award, path: "/admin/certifications" },
  { label: "Services", table: "services", icon: Wrench, path: "/admin/services" },
  { label: "Testimonials", table: "testimonials", icon: MessageSquareQuote, path: "/admin/testimonials" },
  { label: "Blog Posts", table: "blog_posts", icon: FileText, path: "/admin/blog" },
];

const quickActions = [
  { label: "Add Project", path: "/admin/projects", icon: Plus },
  { label: "Edit Profile", path: "/admin/profile", icon: User },
  { label: "Edit Hero", path: "/admin/hero", icon: Sparkles },
  { label: "Add Skill", path: "/admin/skills", icon: Code2 },
  { label: "Add Experience", path: "/admin/experience", icon: Briefcase },
  { label: "View Portfolio", path: "/", icon: ExternalLink, external: true },
];

const Dashboard = () => {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    (async () => {
      const results = await Promise.all(
        statTables.map((s) => db.from(s.table).select("id", { count: "exact", head: true }))
      );
      const next: Record<string, number> = {};
      results.forEach((r: any, i: number) => { next[statTables[i].table] = r.count ?? 0; });
      setCounts(next);
      const { count } = await db.from("contact_submissions").select("id", { count: "exact", head: true }).eq("is_read", false);
      setUnread(count ?? 0);
    })();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-sm text-muted-foreground mb-8">Overview of your portfolio content.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
        {statTables.map((s) => (
          <Link key={s.table} to={s.path} className="glass-card rounded-xl p-5 hover:border-primary/40 transition-colors group">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold">{counts[s.table] ?? "—"}</span>
            </div>
            <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{s.label}</p>
          </Link>
        ))}
        <Link to="/admin/messages" className="glass-card rounded-xl p-5 hover:border-primary/40 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <span className="text-2xl font-bold">{unread}</span>
          </div>
          <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Unread Messages</p>
        </Link>
      </div>

      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="flex flex-wrap gap-3">
        {quickActions.map((a) =>
          a.external ? (
            <a key={a.label} href={a.path} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary/60 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors">
              <a.icon className="h-4 w-4" /> {a.label}
            </a>
          ) : (
            <Link key={a.label} to={a.path} className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary/60 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-colors">
              <a.icon className="h-4 w-4" /> {a.label}
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;
