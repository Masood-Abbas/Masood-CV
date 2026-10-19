import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Mail, MailOpen, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const db = supabase as any;

const Messages = () => {
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [open, setOpen] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await db.from("contact_submissions").select("*").order("created_at", { ascending: false });
    if (error) toast({ variant: "destructive", title: "Failed to load", description: error.message });
    setRows(data ?? []);
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const toggleRead = async (row: any, value?: boolean) => {
    const next = value ?? !row.is_read;
    const { error } = await db.from("contact_submissions").update({ is_read: next }).eq("id", row.id);
    if (error) return toast({ variant: "destructive", title: "Update failed", description: error.message });
    setRows((r) => r.map((x) => (x.id === row.id ? { ...x, is_read: next } : x)));
  };

  const remove = async (row: any) => {
    if (!confirm(`Delete message from ${row.name}?`)) return;
    const { error } = await db.from("contact_submissions").delete().eq("id", row.id);
    if (error) return toast({ variant: "destructive", title: "Delete failed", description: error.message });
    toast({ title: "Message deleted" });
    setRows((r) => r.filter((x) => x.id !== row.id));
  };

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return rows.filter((r) =>
      (filter === "all" || (filter === "unread" ? !r.is_read : r.is_read)) &&
      (!s || [r.name, r.email, r.subject, r.message].some((v) => String(v ?? "").toLowerCase().includes(s)))
    );
  }, [rows, search, filter]);

  const unread = rows.filter((r) => !r.is_read).length;

  return (
    <div>
      <h1 className="text-2xl font-bold">Messages</h1>
      <p className="text-sm text-muted-foreground mb-6">{unread} unread of {rows.length}</p>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search messages..." className="pl-9 bg-secondary/50 border-border" />
        </div>
        <div className="flex gap-2">
          {(["all", "unread", "read"] as const).map((f) => (
            <Button key={f} size="sm" variant={filter === f ? "default" : "outline"} onClick={() => setFilter(f)} className="capitalize">{f}</Button>
          ))}
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-lg font-medium mb-2">No messages</p>
          <p className="text-sm text-muted-foreground">Contact form submissions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className={`glass-card rounded-xl p-4 ${!r.is_read ? "border-primary/40" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <button className="text-left flex-1 min-w-0" onClick={() => { setOpen(open === r.id ? null : r.id); if (!r.is_read) toggleRead(r, true); }}>
                  <div className="flex items-center gap-2">
                    {!r.is_read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                    <span className="font-medium truncate">{r.name}</span>
                    <span className="text-sm text-muted-foreground truncate">&lt;{r.email}&gt;</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{r.subject || r.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleString()}</p>
                </button>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="sm" onClick={() => toggleRead(r)} aria-label={r.is_read ? "Mark unread" : "Mark read"}>
                    {r.is_read ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(r)} className="text-destructive hover:text-destructive" aria-label="Delete"><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              {open === r.id && (
                <div className="mt-4 pt-4 border-t border-border/40 text-sm space-y-1">
                  {r.phone && <p><span className="text-muted-foreground">Phone:</span> {r.phone}</p>}
                  {r.subject && <p><span className="text-muted-foreground">Subject:</span> {r.subject}</p>}
                  <p className="whitespace-pre-wrap pt-2">{r.message}</p>
                  <a href={`mailto:${r.email}`} className="inline-block pt-2 text-primary hover:underline">Reply by email</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;
