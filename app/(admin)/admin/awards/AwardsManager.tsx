"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Check, Trophy } from "lucide-react";

interface Award {
  id: string;
  title: string;
  issuer: string;
  description?: string | null;
  date: string;
  order: number;
}

const empty = (): Omit<Award, "id"> => ({ title: "", issuer: "", description: "", date: "", order: 0 });

export function AwardsManager({ awards: init }: { awards: Award[] }) {
  const [items, setItems] = useState(init);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);

  const startEdit = (a: Award) => { setEditing(a.id); setForm({ ...a, date: a.date?.slice(0, 10) ?? "" }); setAdding(false); };
  const cancelEdit = () => { setEditing(null); setAdding(false); setForm(empty()); };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, date: new Date(form.date).toISOString() };
      if (adding) {
        const res = await fetch("/api/awards", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setItems([...items, created]);
        toast.success("Award added!");
      } else {
        const res = await fetch(`/api/awards/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setItems(items.map((i) => (i.id === editing ? updated : i)));
        toast.success("Award updated!");
      }
      cancelEdit();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this award?")) return;
    try {
      await fetch(`/api/awards/${id}`, { method: "DELETE" });
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
        <button onClick={() => { setAdding(true); setEditing(null); setForm(empty()); }} className="btn-primary flex items-center gap-2">
          <Plus size={14} /> Add Award
        </button>
      </div>

      {isOpen && (
        <div className="glass-card p-6 border border-primary/20 space-y-4">
          <h3 className="font-semibold text-foreground">{adding ? "Add Award" : "Edit Award"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[{ label: "Title", field: "title", placeholder: "Vietnam-Korea Pitching 2nd Prize" }, { label: "Issuer", field: "issuer", placeholder: "Vietnam-Korea Innovation Center" }].map(({ label, field, placeholder }) => (
              <div key={field}>
                <label className="block text-xs text-muted-foreground mb-1">{label}</label>
                <input value={(form as any)[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} placeholder={placeholder} className="input-dark w-full" />
              </div>
            ))}
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Date</label>
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input-dark w-full" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Description</label>
            <textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="input-dark w-full resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2"><Check size={14} /> {saving ? "Saving..." : "Save"}</button>
            <button onClick={cancelEdit} className="btn-secondary flex items-center gap-2"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Trophy size={40} className="mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">No awards yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div key={a.id} className="glass-card p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{a.title}</h3>
                <p className="text-primary text-sm">{a.issuer}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(a.date).toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
                {a.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{a.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(a)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"><Pencil size={14} /></button>
                <button onClick={() => remove(a.id)} className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
