import { useCallback, useEffect, useRef, useState } from "react";
import { Copy, FileText, Loader2, Search, Trash2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const db = supabase as any;
const BUCKET = "media";

interface MediaItem {
  name: string;
  url: string;
  size: number;
  type: string;
  created: string;
}

const fmtSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const Media = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [deleting, setDeleting] = useState<MediaItem | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from(BUCKET).list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });
    if (error) {
      toast({ variant: "destructive", title: "Failed to load media", description: error.message });
      setLoading(false);
      return;
    }
    const files = (data ?? []).filter((f: any) => f.name && f.name !== ".emptyFolderPlaceholder");
    const withUrls = await Promise.all(
      files.map(async (f: any) => {
        const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(f.name, 60 * 60);
        return {
          name: f.name,
          url: signed?.signedUrl ?? "",
          size: f.metadata?.size ?? 0,
          type: f.metadata?.mimetype ?? "",
          created: f.created_at ?? "",
        };
      })
    );
    setItems(withUrls);
    setLoading(false);
  }, [toast]);

  useEffect(() => { load(); }, [load]);

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length || uploading) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type });
      if (error) {
        toast({ variant: "destructive", title: `Upload failed: ${file.name}`, description: error.message });
      } else {
        toast({ title: `${file.name} uploaded` });
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    load();
  };

  const copyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    toast({ title: "Link copied", description: "Note: this link expires in 1 hour." });
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteBusy(true);
    const { error } = await supabase.storage.from(BUCKET).remove([deleting.name]);
    setDeleteBusy(false);
    setDeleting(null);
    if (error) {
      toast({ variant: "destructive", title: "Delete failed", description: error.message });
      return;
    }
    toast({ title: "File deleted" });
    load();
  };

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-sm text-muted-foreground">{items.length} {items.length === 1 ? "file" : "files"}</p>
        </div>
        <div>
          <input ref={fileRef} type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={(e) => handleUpload(e.target.files)} />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading} className="gap-2">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading..." : "Upload Files"}
          </Button>
        </div>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search files..." className="pl-9 bg-secondary/50 border-border" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <p className="text-lg font-medium mb-2">{search ? "No files found" : "No files yet"}</p>
          <p className="text-sm text-muted-foreground mb-6">{search ? "Try a different search term." : "Upload images or PDFs to use across your portfolio."}</p>
          {!search && <Button onClick={() => fileRef.current?.click()} className="gap-2"><Upload className="h-4 w-4" /> Upload your first file</Button>}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.name} className="glass-card rounded-xl overflow-hidden group">
              <div className="aspect-square bg-secondary/40 flex items-center justify-center overflow-hidden">
                {item.type.startsWith("image/") ? (
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <FileText className="h-10 w-10 text-muted-foreground" />
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium truncate" title={item.name}>{item.name}</p>
                <p className="text-xs text-muted-foreground">{fmtSize(item.size)}</p>
                <div className="flex gap-1 mt-2">
                  <Button variant="ghost" size="sm" onClick={() => copyUrl(item)} className="gap-1 h-7 px-2 text-xs"><Copy className="h-3 w-3" /> Copy URL</Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleting(item)} className="gap-1 h-7 px-2 text-xs text-destructive hover:text-destructive"><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete file?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete "{deleting?.name}". This action cannot be undone.</AlertDialogDescription>
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

export default Media;
