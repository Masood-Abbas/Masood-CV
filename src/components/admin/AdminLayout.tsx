import { useState } from "react";
import { Navigate, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, User, Sparkles, FolderKanban, Code2, Briefcase,
  GraduationCap, Award, Wrench, MessageSquareQuote, FileText, Mail,
  Image, Navigation, Settings, LogOut, Menu, X, ExternalLink, Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

const navSections = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  { label: "Profile", path: "/admin/profile", icon: User },
  { label: "Hero", path: "/admin/hero", icon: Sparkles },
  { label: "Projects", path: "/admin/projects", icon: FolderKanban },
  { label: "Skills", path: "/admin/skills", icon: Code2 },
  { label: "Experience", path: "/admin/experience", icon: Briefcase },
  { label: "Education", path: "/admin/education", icon: GraduationCap },
  { label: "Certifications", path: "/admin/certifications", icon: Award },
  { label: "Services", path: "/admin/services", icon: Wrench },
  { label: "Testimonials", path: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "Blog", path: "/admin/blog", icon: FileText },
  { label: "Messages", path: "/admin/messages", icon: Mail },
  { label: "Media", path: "/admin/media", icon: Image },
  { label: "Navigation", path: "/admin/navigation", icon: Navigation },
  { label: "Settings", path: "/admin/settings", icon: Settings },
];

const AdminLayout = () => {
  const { session, isAdmin, loading, signOut, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!session) return <Navigate to="/admin/login" replace />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Not authorized</h1>
        <p className="text-muted-foreground">This account does not have admin access.</p>
        <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  const nav = (
    <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      {navSections.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
            }`
          }
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border/40 bg-card/40 h-screen sticky top-0">
        <div className="p-4 border-b border-border/40">
          <span className="font-bold text-lg">Masood <span className="text-primary">CMS</span></span>
        </div>
        {nav}
        <div className="p-3 border-t border-border/40 space-y-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
            <ExternalLink className="h-4 w-4" /> View Portfolio
          </a>
          <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-card border-r border-border/40 flex flex-col">
            <div className="p-4 border-b border-border/40 flex items-center justify-between">
              <span className="font-bold text-lg">Masood <span className="text-primary">CMS</span></span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
            </div>
            {nav}
            <div className="p-3 border-t border-border/40 space-y-2">
              <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                <ExternalLink className="h-4 w-4" /> View Portfolio
              </a>
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border/40 flex items-center justify-between px-4 bg-card/30 sticky top-0 z-40 backdrop-blur-xl">
          <button className="md:hidden p-2" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <span className="hidden md:block text-sm text-muted-foreground">Portfolio Admin Panel</span>
          <span className="text-sm text-muted-foreground truncate max-w-[200px]">{user?.email}</span>
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
