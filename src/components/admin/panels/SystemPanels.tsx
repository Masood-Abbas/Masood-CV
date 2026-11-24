import { useRef, useState } from "react";
import {
  AlertTriangle,
  Download,
  ExternalLink,
  FileJson,
  FileCode2,
  Inbox,
  KeyRound,
  Lock,
  MailCheck,
  MailOpen,
  RotateCcw,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminCard, TextField } from "../AdminUI";
import { usePortfolio } from "@/data/PortfolioContext";
import { changePassword, isDefaultPasswordActive, MIN_PASSWORD_LENGTH } from "@/data/auth";
import {
  buildDefaultPortfolioSource,
  exportPortfolioJson,
  parseImportedPortfolio,
} from "@/data/store";
import { downloadTextFile, formatDateTime, readFileAsText } from "@/lib/files";
import type { AdminSectionId } from "../sections";

const stamp = () => new Date().toISOString().slice(0, 10);

/* -------------------------------------------------------- dashboard */

export function DashboardPanel({
  onNavigate,
  onLock,
}: {
  onNavigate: (section: AdminSectionId) => void;
  onLock: () => void;
}) {
  const { data, messages, lastSavedAt } = usePortfolio();
  const unread = messages.filter((message) => !message.read).length;

  const stats: { label: string; value: number; section: AdminSectionId; hint: string }[] = [
    { label: "Projects", value: data.projects.length, section: "projects", hint: "shown on the site" },
    {
      label: "Experience",
      value: data.experiences.length,
      section: "experience",
      hint: "timeline entries",
    },
    {
      label: "Skills",
      value: data.skillCategories.reduce((total, group) => total + group.skills.length, 0),
      section: "skills",
      hint: `across ${data.skillCategories.length} groups`,
    },
    { label: "Education", value: data.education.length, section: "education", hint: "qualifications" },
    { label: "Quick facts", value: data.about.details.length, section: "about", hint: "about the summary" },
    { label: "Messages", value: unread, section: "messages", hint: unread ? "unread" : "all read" },
  ];

  const recent = messages.slice(0, 3);

  return (
    <div className="space-y-6">
      <AdminCard
        title={`Welcome back, ${data.site.firstName || "there"}`}
        description="Everything on your portfolio can be edited, added to or deleted from this panel. Changes save instantly."
        actions={
          <Button variant="outline" size="sm" className="gap-2" onClick={onLock}>
            <Lock className="h-4 w-4" />
            Lock
          </Button>
        }
      >
        <div className="flex flex-wrap gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              View site
            </Button>
          </a>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => onNavigate("settings")}>
            <Download className="h-4 w-4" />
            Backups
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => onNavigate("messages")}>
            <Inbox className="h-4 w-4" />
            Inbox{unread ? ` (${unread})` : ""}
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          {lastSavedAt
            ? `Last change saved ${lastSavedAt.toLocaleTimeString()}.`
            : "Your edits are stored in this browser. Export a backup before clearing browser data."}
        </p>
      </AdminCard>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <button
            key={stat.label}
            type="button"
            onClick={() => onNavigate(stat.section)}
            className="glass-card rounded-xl p-4 text-left transition-colors hover:border-primary/40"
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.hint}</p>
          </button>
        ))}
      </div>

      <AdminCard
        title="Latest messages"
        description="Messages sent through the contact form in this browser."
        actions={
          <Button variant="outline" size="sm" onClick={() => onNavigate("messages")}>
            Open inbox
          </Button>
        }
      >
        {recent.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border/70 px-4 py-8 text-center text-sm text-muted-foreground">
            No messages yet.
          </p>
        ) : (
          <div className="space-y-2">
            {recent.map((message) => (
              <div
                key={message.id}
                className="rounded-xl border border-border/60 bg-secondary/25 p-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium">
                    {message.name || "Anonymous"}{" "}
                    <span className="font-normal text-muted-foreground">· {message.email}</span>
                  </p>
                  {!message.read && <Badge className="bg-primary/15 text-primary">New</Badge>}
                </div>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{message.message}</p>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}

/* --------------------------------------------------------- messages */

export function MessagesPanel() {
  const { messages, setMessageRead, deleteMessage, clearMessages } = usePortfolio();
  const [confirmClear, setConfirmClear] = useState(false);
  const unread = messages.filter((message) => !message.read).length;

  return (
    <div className="space-y-6">
      <AdminCard
        title="Inbox"
        description="Submissions from the contact form. These are stored in this browser only — set a form endpoint in Settings to receive messages from the published site."
        actions={
          messages.length > 0 ? (
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setConfirmClear(true)}>
              <Trash2 className="h-4 w-4" />
              Clear all
            </Button>
          ) : null
        }
      >
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Inbox className="h-4 w-4" />
          {messages.length} total · {unread} unread
        </div>

        {messages.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/70 px-4 py-12 text-center">
            <Inbox className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <p className="mt-3 text-sm text-muted-foreground">No messages yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`rounded-xl border p-4 transition-colors ${
                  message.read ? "border-border/60 bg-secondary/20" : "border-primary/40 bg-primary/5"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {message.name || "Anonymous"}
                      {!message.read && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary align-middle" />}
                    </p>
                    <a
                      href={`mailto:${message.email}`}
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      {message.email}
                    </a>
                  </div>
                  <p className="shrink-0 text-xs text-muted-foreground">
                    {formatDateTime(message.createdAt)}
                  </p>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-foreground/90">{message.message}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setMessageRead(message.id, !message.read)}
                  >
                    {message.read ? <MailOpen className="h-4 w-4" /> : <MailCheck className="h-4 w-4" />}
                    Mark as {message.read ? "unread" : "read"}
                  </Button>
                  <a href={`mailto:${message.email}?subject=Re: your message`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Reply
                    </Button>
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteMessage(message.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </AdminCard>

      <AlertDialog open={confirmClear} onOpenChange={setConfirmClear}>
        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete every message?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes all {messages.length} messages from this browser. It cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                clearMessages();
                toast.success("Inbox cleared");
              }}
            >
              Delete all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* --------------------------------------------------------- settings */

export function SettingsPanel() {
  const { data, update, replace, reset, clearMessages } = usePortfolio();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [usingDefaultPassword, setUsingDefaultPassword] = useState(() => isDefaultPasswordActive());

  const submitPassword = (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError(null);
    if (nextPassword !== confirmPassword) {
      setPasswordError("The new passwords do not match.");
      return;
    }
    const result = changePassword(currentPassword, nextPassword);
    if (!result.ok) {
      setPasswordError(result.error ?? "The password could not be changed.");
      return;
    }
    setCurrentPassword("");
    setNextPassword("");
    setConfirmPassword("");
    setUsingDefaultPassword(isDefaultPasswordActive());
    toast.success("Admin password updated");
  };

  const exportBackup = () => {
    downloadTextFile(`portfolio-backup-${stamp()}.json`, exportPortfolioJson(data), "application/json");
    toast.success("Backup downloaded");
  };

  const exportSource = () => {
    downloadTextFile("defaultPortfolio.ts", buildDefaultPortfolioSource(data), "text/plain");
    toast.success("defaultPortfolio.ts downloaded", {
      description: "Replace src/data/defaultPortfolio.ts with it, then rebuild to publish.",
    });
  };

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const text = await readFileAsText(file);
      const result = parseImportedPortfolio(text);
      if (!result.ok) {
        toast.error(result.error ?? "That file could not be imported.");
        return;
      }
      if (!result.data) {
        toast.error("That file does not contain portfolio data.");
        return;
      }
      replace(result.data);
      toast.success("Portfolio imported");
    } catch {
      toast.error("That file could not be read.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      {usingDefaultPassword && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-medium text-amber-200">You are still using the default password</p>
            <p className="mt-1 text-sm text-amber-200/80">
              Set your own password below so visitors cannot open the admin panel.
            </p>
          </div>
        </div>
      )}

      <AdminCard
        title="Admin password"
        description="Protects this panel. The password is stored only as a salted hash in this browser."
      >
        <form onSubmit={submitPassword} className="space-y-4">
          <TextField
            label="Current password"
            type="password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="New password"
              type="password"
              value={nextPassword}
              onChange={setNextPassword}
              help={`At least ${MIN_PASSWORD_LENGTH} characters.`}
            />
            <TextField
              label="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          </div>
          {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
          <Button type="submit" className="gap-2" disabled={!currentPassword || !nextPassword}>
            <KeyRound className="h-4 w-4" />
            Update password
          </Button>
        </form>
      </AdminCard>

      <AdminCard
        title="Contact form"
        description="Where messages from the public contact form are sent."
      >
        <div className="space-y-4">
          <TextField
            label="Form endpoint (optional)"
            value={data.settings.formEndpoint}
            onChange={(formEndpoint) =>
              update((draft) => ({ ...draft, settings: { ...draft.settings, formEndpoint } }))
            }
            placeholder="https://formspree.io/f/your-id"
            help="A Formspree-style endpoint that accepts JSON POSTs. When empty, the form stores messages in this browser only."
          />
          <p className="text-xs text-muted-foreground">
            Messages submitted in this browser appear in the Messages tab so you can test the form.
          </p>
        </div>
      </AdminCard>

      <AdminCard
        title="Backup & publish"
        description="Your edits live in this browser. Download a backup, or export the code file to publish your content in the deployed site."
      >
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2" onClick={exportBackup}>
            <FileJson className="h-4 w-4" />
            Export JSON backup
          </Button>
          <Button variant="outline" className="gap-2" onClick={exportSource}>
            <FileCode2 className="h-4 w-4" />
            Export portfolio.ts
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" />
            Import backup
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => void handleImport(event.target.files?.[0])}
          />
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Export portfolio.ts replaces <code className="font-mono">src/data/defaultPortfolio.ts</code>. Commit
          that file and redeploy to make these edits visible to every visitor.
        </p>
      </AdminCard>

      <AdminCard title="Danger zone" description="Irreversible actions. Export a backup first.">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2" onClick={() => setConfirmReset(true)}>
            <RotateCcw className="h-4 w-4" />
            Reset content to defaults
          </Button>
          <Button
            variant="outline"
            className="gap-2 text-muted-foreground hover:text-destructive"
            onClick={() => {
              clearMessages();
              toast.success("Inbox cleared");
            }}
          >
            <Trash2 className="h-4 w-4" />
            Clear all messages
          </Button>
        </div>
      </AdminCard>

      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Reset all content?</AlertDialogTitle>
            <AlertDialogDescription>
              Every section returns to the bundled defaults. Your edits and messages are not kept unless you
              exported a backup.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                reset();
                toast.success("Content reset to defaults");
              }}
            >
              Reset everything
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

