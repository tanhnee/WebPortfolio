"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Check, GraduationCap } from "lucide-react";

interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  gpa?: string | null;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description?: string | null;
  order: number;
}

const empty = (): Omit<Education, "id"> => ({
  school: "", degree: "", major: "", gpa: "", startDate: "", endDate: null, current: false, description: "", order: 0,
});

export function EducationManager({ education: init }: { education: Education[] }) {
  const [items, setItems] = useState(init);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);

  const startEdit = (e: Education) => { setEditing(e.id); setForm({ ...e, startDate: e.startDate?.slice(0, 10) ?? "", endDate: e.endDate?.slice(0, 10) ?? "" }); setAdding(false); };
  const cancelEdit = () => { setEditing(null); setAdding(false); setForm(empty()); };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, startDate: new Date(form.startDate).toISOString(), endDate: form.current ? null : (form.endDate ? new Date(form.endDate).toISOString() : null) };
      if (adding) {
        const res = await fetch("/api/education", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setItems([...items, created]);
        toast.success("Education added!");
      } else {
        const res = await fetch(`/api/education/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setItems(items.map((i) => (i.id === editing ? updated : i)));
        toast.success("Education updated!");
      }
      cancelEdit();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this education entry?")) return;
    try {
      await fetch(`/api/education/${id}`, { method: "DELETE" });
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
          <Plus size={14} /> Add Education
        </button>
      </div>

      {isOpen && (
        <div className="glass-card p-6 border border-primary/20 space-y-4">
          <h3 className="font-semibold text-foreground">{adding ? "Add Education" : "Edit Education"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "School", field: "school", placeholder: "University of Economics and Law" },
              { label: "Degree", field: "degree", placeholder: "Bachelor of Science" },
              { label: "Major", field: "major", placeholder: "E-commerce" },
              { label: "GPA", field: "gpa", placeholder: "8.73/10" },
            ].map(({ label, field, placeholder }) => (
              <div key={field}>
                <label className="block text-xs text-muted-foreground mb-1">{label}</label>
                <input value={(form as any)[field] ?? ""} onChange={(e) => setForm({ ...form, [field]: e.target.value })} placeholder={placeholder} className="input-dark w-full" />
              </div>
            ))}
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="input-dark w-full" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">End Date</label>
              <input type="date" value={form.endDate ?? ""} onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={form.current} className="input-dark w-full disabled:opacity-40" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked })} className="accent-primary" />
            Currently studying
          </label>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Description</label>
            <textarea value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-dark w-full resize-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2"><Check size={14} /> {saving ? "Saving..." : "Save"}</button>
            <button onClick={cancelEdit} className="btn-secondary flex items-center gap-2"><X size={14} /> Cancel</button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <GraduationCap size={40} className="mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">No education entries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((e) => (
            <div key={e.id} className="glass-card p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{e.degree} in {e.major}</h3>
                <p className="text-primary text-sm">{e.school}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {e.startDate?.slice(0, 4)} – {e.current ? "Present" : e.endDate?.slice(0, 4)}
                  {e.gpa && ` · GPA: ${e.gpa}`}
                </p>
                {e.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{e.description}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(e)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"><Pencil size={14} /></button>
                <button onClick={() => remove(e.id)} className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
