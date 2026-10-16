import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const db = supabase as any;

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "boolean" | "date" | "select" | "array";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  hideInTable?: boolean;
}

export interface CrudConfig {
  table: string;
  title: string;
  singular: string;
  fields: FieldConfig[];
  searchColumn: string;
  orderBy?: string;
}

const emptyValue = (f: FieldConfig) => {
  switch (f.type) {
    case "boolean": return false;
    case "number": return 0;
    case "array": return [] as string[];
    default: return "";
  }
};

const CrudPage = ({ config }: { config: CrudConfig }) => {
  const { toast } = useToast();
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<any | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    let q = db.from(config.table).select("*");
    if (config.orderBy) q = q.order(config.orderBy, { ascending: true });
    const { data, error } = await q;
    if (error) toast({ variant: "destructive", title: "Failed to load", description: error.message });
    setRows(data ?? []);
    setLoading(false);
  }, [config.table, config.orderBy, toast]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const s = search.toLowerCase();
    return rows.filter((r) => String(r[config.searchColumn] ?? "").toLowerCase().includes(s));
  }, [rows, search, config.searchColumn]);

  const openCreate = () => {
    setEditing(null);
    const init: Record<string, any> = {};
    config.fields.forEach((f) => { init[f.name] = emptyValue(f); });
    setForm(init);
    setDialogOpen(true);
  };

  const openEdit = (row: any) => {
    setEditing(row);
    const init: Record<string, any> = {};
    config.fields.forEach((f) => { init[f.name] = row[f.name] ?? emptyValue(f); });
    setForm(init);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    for (const f of config.fields) {
      if (f.required && f.type !== "boolean" && !String(form[f.name] ?? "").trim()) {
        toast({ variant: "destructive", title: `${f.label} is required` });
        return;
      }
    }
    setSaving(true);
    const payload: Record<string, any> = {};
    config.fields.forEach((f) => {
      let v = form[f.name];
      if (f.type === "number") v = v === "" || v == null ? 0 : Number(v);
      if (f.type === "array") v = Array.isArray(v) ? v : String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      if ((f.type === "text" || f.type === "textarea" || f.type === "date" || f.type === "select") && v === "") v = null;
      if (f.required && v === null) v = "";
      payload[f.name] = v;
    });
    const { error } = editing
      ? await db.from(config.table).update(payload).eq("id", editing.id)
      : await db.from(config.table).insert(payload);
    setSaving(false);
    if (error) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
      return;
    }
    toast({ title: `${config.singular} ${editing ? "updated" : "created"} successfully` });
    setDialogOpen(false);
    load();
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    const { error } = await db.from(config.table).delete().eq("id", deleting.id);
    setDeleteBusy(false);
    setDeleting(null);
    if (error) {
      toast({ variant: "destructive", title: "Delete failed", description: error.message });
      return;
    }
    toast({ title: `${config.singular} deleted` });
    load();
  };

  const tableFields = config.fields.filter((f) => !f.hideInTable).slice(0, 4);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">{config.title}</h1>
          <p className="text-sm text-muted-foreground">{rows.length} {rows.length === 1 ? "item" : "items"}</p>
        </div>
        <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Add {config.singular}</Button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={`Search ${config.title.toLowerCase()}...`} className="pl-9 bg-secondary/50 border-border" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-lg font-medium mb-2">{search ? "No results found" : `No ${config.title.toLowerCase()} yet`}</p>
          <p className="text-sm text-muted-foreground mb-6">{search ? "Try a different search term." : `Create your first ${config.singular.toLowerCase()} to get started.`}</p>
          {!search && <Button onClick={openCreate} className="gap-2"><Plus className="h-4 w-4" /> Add {config.singular}</Button>}
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/40 text-left">
                {tableFields.map((f) => <th key={f.name} className="px-4 py-3 font-medium text-muted-foreground">{f.label}</th>)}
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-border/20 last:border-0 hover:bg-secondary/30">
                  {tableFields.map((f) => (
                    <td key={f.name} className="px-4 py-3 max-w-[240px] truncate">
                      {f.type === "boolean" ? (
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${row[f.name] ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                          {row[f.name] ? "Yes" : "No"}
                        </span>
                      ) : f.type === "array" ? (
                        (row[f.name] ?? []).join(", ") || "—"
                      ) : (
                        String(row[f.name] ?? "—")
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(row)} className="gap-1"><Pencil className="h-3.5 w-3.5" /> Edit</Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleting(row)} className="gap-1 text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /> Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${config.singular}` : `Add ${config.singular}`}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-2">
            {config.fields.map((f) => (
              <div key={f.name} className={f.type === "textarea" || f.type === "array" ? "sm:col-span-2" : ""}>
                {f.type === "boolean" ? (
                  <label className="flex items-center justify-between gap-4 py-2">
                    <span className="text-sm font-medium">{f.label}</span>
                    <Switch checked={!!form[f.name]} onCheckedChange={(v) => setForm({ ...form, [f.name]: v })} />
                  </label>
                ) : (
                  <>
                    <label className="block text-sm font-medium mb-1.5">{f.label}{f.required && <span className="text-destructive"> *</span>}</label>
                    {f.type === "textarea" ? (
                      <Textarea value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} placeholder={f.placeholder} rows={4} className="bg-secondary/50 border-border" />
                    ) : f.type === "array" ? (
                      <Input value={Array.isArray(form[f.name]) ? form[f.name].join(", ") : form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} placeholder={f.placeholder ?? "Comma separated values"} className="bg-secondary/50 border-border" />
                    ) : f.type === "select" ? (
                      <Select value={form[f.name] ?? ""} onValueChange={(v) => setForm({ ...form, [f.name]: v })}>
                        <SelectTrigger className="bg-secondary/50 border-border"><SelectValue placeholder="Select..." /></SelectTrigger>
                        <SelectContent>
                          {(f.options ?? []).map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"} value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} placeholder={f.placeholder} className="bg-secondary/50 border-border" />
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {config.singular}?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleting?.[config.searchColumn]}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteBusy}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteBusy} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {deleteBusy ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CrudPage;
