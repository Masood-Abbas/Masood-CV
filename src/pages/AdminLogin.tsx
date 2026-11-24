import { useEffect, useState } from "react";
import { ArrowLeft, Eye, EyeOff, Loader2, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DEFAULT_ADMIN_PASSWORD,
  isDefaultPasswordActive,
  login,
  ensureAuthInitialized,
} from "@/data/auth";

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockedSeconds, setLockedSeconds] = useState(0);
  const [defaultActive, setDefaultActive] = useState(false);

  useEffect(() => {
    ensureAuthInitialized();
    setDefaultActive(isDefaultPasswordActive());
  }, []);

  useEffect(() => {
    if (lockedSeconds <= 0) return;
    const timer = setInterval(() => setLockedSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => clearInterval(timer);
  }, [lockedSeconds]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (submitting || lockedSeconds > 0) return;

    setError(null);
    setSubmitting(true);

    // Let the button paint its loading state before the hash runs.
    window.setTimeout(() => {
      const result = login(password);
      setSubmitting(false);

      if (result.ok) {
        onSuccess();
        return;
      }

      if (result.reason === "locked-out") {
        setLockedSeconds(Math.ceil((result.remainingMs ?? 60000) / 1000));
        setError("Too many attempts. Please wait before trying again.");
      } else {
        setError("That password is incorrect.");
      }
      setPassword("");
    }, 30);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(175_80%_50%/0.16),transparent_45%),radial-gradient(circle_at_80%_0%,hsl(200_80%_50%/0.12),transparent_40%)]"
      />

      <div className="relative w-full max-w-md">
        <div className="glass-card rounded-2xl p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Admin access</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This area is private. Enter the admin password to manage the portfolio.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  autoFocus
                  disabled={lockedSeconds > 0}
                  className="border-border bg-secondary/40 pl-9 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
                {lockedSeconds > 0 && ` (${lockedSeconds}s)`}
              </p>
            )}

            <Button
              type="submit"
              disabled={!password || submitting || lockedSeconds > 0}
              className="w-full gap-2 glow-box"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              {submitting ? "Checking…" : "Unlock admin"}
            </Button>
          </form>

          {defaultActive && (
            <p className="mt-6 rounded-lg border border-border/70 bg-secondary/30 px-3 py-2 text-center text-xs text-muted-foreground">
              First time here? The default password is{" "}
              <code className="font-mono text-foreground">{DEFAULT_ADMIN_PASSWORD}</code>. Change it in Settings
              right after signing in.
            </p>
          )}
        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to the site
          </a>
        </div>
      </div>
    </div>
  );
}
