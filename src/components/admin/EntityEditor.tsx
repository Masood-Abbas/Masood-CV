import { useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TextAreaField, TextField, AdminCard, Field, IconSelect, StringListEditor } from "./AdminUI";

export type FieldType = "text" | "textarea" | "list" | "icon" | "select" | "url";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  help?: string;
  rows?: number;
  options?: string[];
  required?: boolean;
}

/** Reads one field from a loosely typed entity without leaking `any`. */
const fieldValue = (record: object, key: string): unknown =>
  (record as Record<string, unknown>)[key];

interface EntityListEditorProps<T extends object> {
  title: string;
  description?: string;
  itemNoun: string;
  items: T[];
  fields: FieldDef[];
  createItem: () => T;
  onChange: (items: T[]) => void;
  titleKey: keyof T & string;
  subtitleKey?: keyof T & string;
  metaLabel?: (item: T) => string | null;
  addLabel?: string;
  emptyMessage?: string;
  icon?: ReactNode;
  extra?: ReactNode;
}

function renderFieldControl(
  field: FieldDef,
  draft: Record<string, unknown>,
  setValue: (key: string, value: unknown) => void,
) {
  const value = draft[field.key];

  switch (field.type) {
    case "textarea":
      return (
        <TextAreaField
          key={field.key}
          id={`entity-${field.key}`}
          label={field.label}
          help={field.help}
          rows={field.rows ?? 4}
          placeholder={field.placeholder}
          value={typeof value === "string" ? value : ""}
          onChange={(next) => setValue(field.key, next)}
        />
      );
    case "list":
      return (
        <StringListEditor
          key={field.key}
          label={field.label}
          help={field.help}
          placeholder={field.placeholder}
          value={Array.isArray(value) ? value : []}
          onChange={(next) => setValue(field.key, next)}
        />
      );
    case "icon":
      return (
        <IconSelect
          key={field.key}
          label={field.label}
          help={field.help}
          value={typeof value === "string" ? value : ""}
          onChange={(next) => setValue(field.key, next)}
        />
      );
    case "select":
      return (
        <Field key={field.key} label={field.label} help={field.help}>
          <div className="flex flex-wrap gap-2">
            {(field.options ?? []).map((option) => (
              <Button
                key={option}
                type="button"
                size="sm"
                variant={value === option ? "default" : "outline"}
                onClick={() => setValue(field.key, option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </Field>
      );
    default:
      return (
        <TextField
          key={field.key}
          id={`entity-${field.key}`}
          label={field.label}
          help={field.help}
          type={field.type === "url" ? "url" : "text"}
          placeholder={field.placeholder}
          value={typeof value === "string" ? value : ""}
          onChange={(next) => setValue(field.key, next)}
        />
      );
  }
}

export function EntityListEditor<T extends object>({
  title,
  description,
  itemNoun,
  items,
  fields,
  createItem,
  onChange,
  titleKey,
  subtitleKey,
  metaLabel,
  addLabel,
  emptyMessage,
  icon,
  extra,
}: EntityListEditorProps<T>) {
  const [editor, setEditor] = useState<{ index: number | null; draft: T } | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const openCreate = () => setEditor({ index: null, draft: createItem() });

  const openEdit = (index: number) =>
    setEditor({ index, draft: JSON.parse(JSON.stringify(items[index])) as T });

  const setValue = (key: string, value: unknown) => {
    setEditor((current) =>
      current ? { ...current, draft: { ...current.draft, [key]: value } as T } : current,
    );
  };

  const missingRequired = editor
    ? fields.filter(
        (field) =>
          field.required &&
          (typeof fieldValue(editor.draft, field.key) !== "string" ||
            !(fieldValue(editor.draft, field.key) as string).trim()),
      )
    : [];

  const save = () => {
    if (!editor) return;
    if (missingRequired.length > 0) {
      toast.error(`Please fill in: ${missingRequired.map((field) => field.label).join(", ")}`);
      return;
    }

    if (editor.index === null) {
      onChange([...items, editor.draft]);
      toast.success(`New ${itemNoun} added`);
    } else {
      onChange(items.map((item, index) => (index === editor.index ? editor.draft : item)));
      toast.success(`${itemNoun} updated`);
    }
    setEditor(null);
  };

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const remove = () => {
    if (deleteIndex === null) return;
    onChange(items.filter((_, index) => index !== deleteIndex));
    setDeleteIndex(null);
    toast.success(`${itemNoun} deleted`);
  };

  return (
    <>
      <AdminCard
        title={title}
        description={description}
        actions={
          <Button onClick={openCreate} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            {addLabel ?? `Add ${itemNoun}`}
          </Button>
        }
      >
        {extra}
        <div className="space-y-2">
          {items.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/70 px-4 py-10 text-center">
              <p className="text-sm text-muted-foreground">
                {emptyMessage ?? `No ${itemNoun}s yet.`}
              </p>
              <Button onClick={openCreate} variant="outline" size="sm" className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                {addLabel ?? `Add ${itemNoun}`}
              </Button>
            </div>
          )}

          {items.map((item, index) => {
            const heading = String(fieldValue(item, titleKey) ?? "").trim();
            const subtitle = subtitleKey ? String(fieldValue(item, subtitleKey) ?? "").trim() : "";
            const meta = metaLabel?.(item);
            return (
              <div
                key={index}
                className="flex flex-wrap items-center gap-3 rounded-xl border border-border/60 bg-secondary/25 p-3 transition-colors hover:border-border"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {icon ?? <span className="text-xs font-semibold">{index + 1}</span>}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{heading || `Untitled ${itemNoun}`}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {[subtitle, meta].filter(Boolean).join(" · ") || "No details yet"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Move ${itemNoun} up`}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => move(index, 1)}
                    disabled={index === items.length - 1}
                    aria-label={`Move ${itemNoun} down`}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => openEdit(index)}
                    aria-label={`Edit ${itemNoun}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteIndex(index)}
                    aria-label={`Delete ${itemNoun}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </AdminCard>

      <Dialog open={editor !== null} onOpenChange={(open) => !open && setEditor(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editor?.index === null ? `Add ${itemNoun}` : `Edit ${itemNoun}`}
            </DialogTitle>
            <DialogDescription>
              {editor?.index === null
                ? `Create a new ${itemNoun}. It appears on the site immediately after saving.`
                : `Update this ${itemNoun}.`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {editor &&
              fields.map((field) =>
                renderFieldControl(field, editor.draft as unknown as Record<string, unknown>, setValue),
              )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setEditor(null)}>
              Cancel
            </Button>
            <Button onClick={save}>Save {itemNoun}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteIndex !== null} onOpenChange={(open) => !open && setDeleteIndex(null)}>
        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {itemNoun}?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteIndex !== null
                ? `“${
                    String(
                      deleteIndex !== null && items[deleteIndex]
                        ? fieldValue(items[deleteIndex], titleKey) ?? ""
                        : "",
                    ).trim() || `Untitled ${itemNoun}`
                  }” will be removed from the site. This cannot be undone.`
                : ""}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={remove}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
