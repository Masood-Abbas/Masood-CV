import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "@/hooks/use-auth";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminLogin from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import Messages from "./pages/admin/Messages";
import * as S from "./pages/admin/Sections";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="profile" element={<S.ProfileAdmin />} />
              <Route path="hero" element={<S.HeroAdmin />} />
              <Route path="projects" element={<S.ProjectsAdmin />} />
              <Route path="skills" element={<S.SkillsAdmin />} />
              <Route path="experience" element={<S.ExperienceAdmin />} />
              <Route path="education" element={<S.EducationAdmin />} />
              <Route path="certifications" element={<S.CertificationsAdmin />} />
              <Route path="services" element={<S.ServicesAdmin />} />
              <Route path="testimonials" element={<S.TestimonialsAdmin />} />
              <Route path="blog" element={<S.BlogAdmin />} />
              <Route path="messages" element={<Messages />} />
              <Route path="media" element={<S.MediaAdmin />} />
              <Route path="navigation" element={<S.NavigationAdmin />} />
              <Route path="settings" element={<S.SettingsAdmin />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
