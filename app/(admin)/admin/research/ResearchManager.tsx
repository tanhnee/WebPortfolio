"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Check, BookOpen } from "lucide-react";

interface Research {
  id: string;
  title: string;
  journal?: string | null;
  conference?: string | null;
  authors: string[];
  abstract: string;
  doi?: string | null;
  pdfUrl?: string | null;
  publishedAt?: string | null;
  status: string;
  tags: string[];
}

const empty = (): Omit<Research, "id"> => ({
  title: "", journal: "", conference: "", authors: [], abstract: "",
  doi: "", pdfUrl: "", publishedAt: "", status: "published", tags: [],
});

export function ResearchManager({ research: init }: { research: Research[] }) {
  const [items, setItems] = useState(init);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);
  const [authorsStr, setAuthorsStr] = useState("");
  const [tagsStr, setTagsStr] = useState("");

  const startEdit = (r: Research) => {
    setEditing(r.id);
    setForm({ ...r, publishedAt: r.publishedAt?.slice(0, 10) ?? "" });
    setAuthorsStr(r.authors.join(", "));
    setTagsStr(r.tags.join(", "));
    setAdding(false);
  };

  const cancelEdit = () => { setEditing(null); setAdding(false); setForm(empty()); setAuthorsStr(""); setTagsStr(""); };

  const save = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        authors: authorsStr.split(",").map((s) => s.trim()).filter(Boolean),
        tags: tagsStr.split(",").map((s) => s.trim()).filter(Boolean),
        publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
      };
      if (adding) {
        const res = await fetch("/api/research", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setItems([...items, created]);
        toast.success("Research added!");
      } else {
        const res = await fetch(`/api/research/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setItems(items.map((i) => (i.id === editing ? updated : i)));
        toast.success("Research updated!");
      }
      cancelEdit();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this research paper?")) return;
    try {
      await fetch(`/api/research/${id}`, { method: "DELETE" });
      setItems(items.filter((i) => i.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const isOpen = adding || editing !== null;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => { setAdding(true); setEditing(null); setForm(empty()); setAuthorsStr(""); setTagsStr(""); }} className="btn-primary flex items-center gap-2">
          <Plus size={14} /> Add Research
        </button>
      </div>

      {isOpen && (
        <div className="glass-card p-6 border border-primary/20 space-y-4">
          <h3 className="font-semibold text-foreground">{adding ? "Add Research Paper" : "Edit Research Paper"}</h3>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-dark w-full" placeholder="Blockchain for ESG..." />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Journal</label>
              <input value={form.journal ?? ""} onChange={(e) => setForm({ ...form, journal: e.target.value })} className="input-dark w-full" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Conference</label>
              <input value={form.conference ?? ""} onChange={(e) => setForm({ ...form, conference: e.target.value })} className="input-dark w-full" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Published Date</label>
              <input type="date" value={form.publishedAt ?? ""} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} className="input-dark w-full" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-dark w-full">
                <option value="published">Published</option>
                <option value="under_review">Under Review</option>
                <option value="working_paper">Working Paper</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">DOI</label>
              <input value={form.doi ?? ""} onChange={(e) => setForm({ ...form, doi: e.target.value })} className="input-dark w-full" placeholder="10.xxxx/..." />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">PDF URL</label>
              <input value={form.pdfUrl ?? ""} onChange={(e) => setForm({ ...form, pdfUrl: e.target.value })} className="input-dark w-full" placeholder="https://..." />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Authors (comma separated)</label>
            <input value={authorsStr} onChange={(e) => setAuthorsStr(e.target.value)} className="input-dark w-full" placeholder="Tran Le Buu Tanh, Nguyen Van A" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Tags (comma separated)</label>
            <input value={tagsStr} onChange={(e) => setTagsStr(e.target.value)} className="input-dark w-full" placeholder="Blockchain, ESG, Data Analytics" />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Abstract</label>
            <textarea value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} rows={4} className="input-dark w-full resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2"><Check size={14} /> {saving ? "Saving..." : "Save"}</button>
            <button onClick={cancelEdit} className="btn-secondary flex items-center gap-2"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <BookOpen size={40} className="mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">No research papers yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((r) => (
            <div key={r.id} className="glass-card p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{r.title}</h3>
                <p className="text-primary text-sm">{r.journal || r.conference}</p>
                <p className="text-xs text-muted-foreground mt-1">{r.authors.join(", ")}</p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{r.abstract}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {r.tags.map((t) => <span key={t} className="px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent border border-accent/20">{t}</span>)}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(r)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"><Pencil size={14} /></button>
                <button onClick={() => remove(r.id)} className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
