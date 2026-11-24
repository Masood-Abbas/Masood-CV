import { useId, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, GripVertical, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { iconNames, getIcon } from "@/data/icons";
import { cn } from "@/lib/utils";

/* ---------------------------------------------------------------- card */

export function AdminCard({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("glass-card rounded-2xl p-6", className)}>
      {(title || actions) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {title && <h2 className="text-lg font-semibold tracking-tight">{title}</h2>}
            {description && (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

/* --------------------------------------------------------------- field */

export function Field({
  label,
  help,
  htmlFor,
  children,
  className,
}: {
  label?: string;
  help?: string;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </Label>
      )}
      {children}
      {help && <p className="text-xs text-muted-foreground">{help}</p>}
    </div>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  help,
  type = "text",
  id,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  help?: string;
  type?: string;
  id?: string;
}) {
  const generatedId = useId();
  const inputId = id ?? `field-${generatedId}`;

  return (
    <Field label={label} help={help} htmlFor={inputId}>
      <Input
        id={inputId}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="border-border bg-secondary/40"
      />
    </Field>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  help,
  rows = 4,
  id,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  help?: string;
  rows?: number;
  id?: string;
}) {
  const generatedId = useId();
  const inputId = id ?? `field-${generatedId}`;

  return (
    <Field label={label} help={help} htmlFor={inputId}>
      <Textarea
        id={inputId}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="resize-y border-border bg-secondary/40"
      />
    </Field>
  );
}

export function SwitchField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-border/70 bg-secondary/25 px-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} aria-label={label} />
    </div>
  );
}

/* ---------------------------------------------------------- string list */

export function StringListEditor({
  label,
  value,
  onChange,
  placeholder = "Add an item…",
  help,
  addLabel = "Add",
  emptyText = "Nothing here yet.",
  multiline = false,
}: {
  label?: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  help?: string;
  addLabel?: string;
  emptyText?: string;
  multiline?: boolean;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onChange([...value, trimmed]);
    setDraft("");
  };

  const replaceAt = (index: number, next: string) =>
    onChange(value.map((item, itemIndex) => (itemIndex === index ? next : item)));

  const removeAt = (index: number) => onChange(value.filter((_, itemIndex) => itemIndex !== index));

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return (
    <Field label={label} help={help}>
      <div className="space-y-2">
        {value.length === 0 && (
          <p className="rounded-lg border border-dashed border-border/70 px-3 py-4 text-center text-xs text-muted-foreground">
            {emptyText}
          </p>
        )}
        {value.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <GripVertical className="mt-3 h-4 w-4 shrink-0 text-muted-foreground/50" aria-hidden />
            {multiline ? (
              <Textarea
                value={item}
                rows={4}
                onChange={(event) => replaceAt(index, event.target.value)}
                className="resize-y border-border bg-secondary/40"
              />
            ) : (
              <Input
                value={item}
                onChange={(event) => replaceAt(index, event.target.value)}
                className="border-border bg-secondary/40"
              />
            )}
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-9 w-9 shrink-0"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              aria-label="Move up"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-9 w-9 shrink-0"
              onClick={() => move(index, 1)}
              disabled={index === value.length - 1}
              aria-label="Move down"
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => removeAt(index)}
              aria-label="Remove item"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <div className="flex items-center gap-2 pt-1">
          <Input
            value={draft}
            placeholder={placeholder}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                add();
              }
            }}
            className="border-border bg-secondary/40"
          />
          <Button type="button" variant="outline" onClick={add} className="shrink-0 gap-2" disabled={!draft.trim()}>
            <Plus className="h-4 w-4" />
            {addLabel}
          </Button>
        </div>
      </div>
    </Field>
  );
}

/* ------------------------------------------------------------ icon pick */

export function IconSelect({
  label = "Icon",
  value,
  onChange,
  help,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  help?: string;
}) {
  const Current = getIcon(value);
  return (
    <Field label={label} help={help}>
      <Select value={value || "Globe"} onValueChange={onChange}>
        <SelectTrigger className="border-border bg-secondary/40">
          <SelectValue>
            <span className="flex items-center gap-2">
              <Current className="h-4 w-4 text-primary" />
              {value || "Globe"}
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-72">
          {iconNames.map((name) => {
            const Icon = getIcon(name);
            return (
              <SelectItem key={name} value={name}>
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {name}
                </span>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </Field>
  );
}
