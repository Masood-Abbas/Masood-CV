import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import type { FieldConfig } from "@/components/admin/CrudPage";

const db = supabase as any;

interface SingletonFormProps {
  table: string;
  title: string;
  description?: string;
  fields: FieldConfig[];
}

const SingletonForm = ({ table, title, description, fields }: SingletonFormProps) => {
  const { toast } = useToast();
  const [rowId, setRowId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await db.from(table).select("*").limit(1).maybeSingle();
      if (error) toast({ variant: "destructive", title: "Failed to load", description: error.message });
      if (data) {
        setRowId(data.id);
        const init: Record<string, any> = {};
        fields.forEach((f) => { init[f.name] = data[f.name] ?? (f.type === "boolean" ? false : f.type === "array" ? [] : ""); });
        setForm(init);
      } else {
        const init: Record<string, any> = {};
        fields.forEach((f) => { init[f.name] = f.type === "boolean" ? false : f.type === "array" ? [] : ""; });
        setForm(init);
      }
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  const handleSave = async () => {
    for (const f of fields) {
      if (f.required && f.type !== "boolean" && !String(form[f.name] ?? "").trim()) {
        toast({ variant: "destructive", title: `${f.label} is required` });
        return;
      }
    }
    setSaving(true);
    const payload: Record<string, any> = {};
    fields.forEach((f) => {
      let v = form[f.name];
      if (f.type === "array") v = Array.isArray(v) ? v : String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
      if ((f.type === "text" || f.type === "textarea") && v === "" && !f.required) v = null;
      payload[f.name] = v;
    });
    const { data, error } = rowId
      ? await db.from(table).update(payload).eq("id", rowId).select("id").single()
      : await db.from(table).insert(payload).select("id").single();
    setSaving(false);
    if (error) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
      return;
    }
    if (!rowId && data?.id) setRowId(data.id);
    toast({ title: `${title} saved successfully` });
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-1">{title}</h1>
      {description && <p className="text-sm text-muted-foreground mb-6">{description}</p>}
      <div className="glass-card rounded-2xl p-6 md:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map((f) => (
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
                    <Textarea value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} placeholder={f.placeholder} rows={5} className="bg-secondary/50 border-border" />
                  ) : f.type === "array" ? (
                    <Input value={Array.isArray(form[f.name]) ? form[f.name].join(", ") : form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} placeholder={f.placeholder ?? "Comma separated values"} className="bg-secondary/50 border-border" />
                  ) : (
                    <Input value={form[f.name] ?? ""} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} placeholder={f.placeholder} className="bg-secondary/50 border-border" />
                  )}
                </>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-6">
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SingletonForm;
