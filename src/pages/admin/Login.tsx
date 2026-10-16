import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Loader2, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const { session, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && session && isAdmin) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setSubmitting(false);
    if (error) {
      toast({ variant: "destructive", title: "Sign in failed", description: error.message });
      return;
    }
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="glass-card rounded-2xl p-8 w-full max-w-md">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 rounded-lg bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">Sign in to manage your portfolio content.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium mb-2">Email</label>
            <Input id="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="bg-secondary/50 border-border" />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium mb-2">Password</label>
            <Input id="admin-password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-secondary/50 border-border" />
          </div>
          <Button type="submit" disabled={submitting} className="w-full gap-2">
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <a href="/" className="block text-center text-sm text-muted-foreground hover:text-primary mt-6 transition-colors">
          ← Back to portfolio
        </a>
      </div>
    </div>
  );
};

export default AdminLogin;
