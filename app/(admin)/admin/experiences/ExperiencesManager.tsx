"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, Check, Briefcase } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Experience {
  id: string;
  company: string;
  position: string;
  type: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  location?: string | null;
  order: number;
}

const empty = (): Omit<Experience, "id"> => ({
  company: "",
  position: "",
  type: "work",
  description: "",
  startDate: "",
  endDate: null,
  current: false,
  location: "",
  order: 0,
});

export function ExperiencesManager({ experiences: init }: { experiences: Experience[] }) {
  const [items, setItems] = useState(init);
  const [editing, setEditing] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(empty());
  const [saving, setSaving] = useState(false);

  const startEdit = (exp: Experience) => {
    setEditing(exp.id);
    setForm({ ...exp, startDate: exp.startDate?.slice(0, 10) ?? "", endDate: exp.endDate?.slice(0, 10) ?? "" });
    setAdding(false);
  };

  const cancelEdit = () => { setEditing(null); setAdding(false); setForm(empty()); };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, startDate: new Date(form.startDate).toISOString(), endDate: form.current ? null : (form.endDate ? new Date(form.endDate).toISOString() : null) };
      if (adding) {
        const res = await fetch("/api/experiences", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
        const created = await res.json();
        setItems([...items, created]);
        toast.success("Experience added!");
      } else {
        const res = await fetch(`/api/experiences/${editing}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setItems(items.map((i) => (i.id === editing ? updated : i)));
        toast.success("Experience updated!");
      }
      cancelEdit();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    try {
      await fetch(`/api/experiences/${id}`, { method: "DELETE" });
      setItems(items.filter((i) => i.id !== id));
      toast.success("Deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const F = ({ label, field, type = "text", placeholder }: { label: string; field: keyof typeof form; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-xs text-muted-foreground mb-1">{label}</label>
      <input type={type} value={(form[field] as string) ?? ""} onChange={(e) => setForm({ ...form, [field]: e.target.value })} placeholder={placeholder} className="input-dark w-full" />
    </div>
  );

  const isOpen = adding || editing !== null;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => { setAdding(true); setEditing(null); setForm(empty()); }} className="btn-primary flex items-center gap-2">
          <Plus size={14} /> Add Experience
        </button>
      </div>

      {isOpen && (
        <div className="glass-card p-6 border border-primary/20 space-y-4">
          <h3 className="font-semibold text-foreground">{adding ? "Add Experience" : "Edit Experience"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <F label="Company" field="company" placeholder="UEL BI Lab" />
            <F label="Position" field="position" placeholder="Research Member" />
            <F label="Location" field="location" placeholder="Ho Chi Minh City" />
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-dark w-full">
                <option value="work">Work</option>
                <option value="research">Research</option>
                <option value="volunteer">Volunteer</option>
                <option value="education">Education</option>
              </select>
            </div>
            <F label="Start Date" field="startDate" type="date" />
            <div>
              <label className="block text-xs text-muted-foreground mb-1">End Date</label>
              <input type="date" value={(form.endDate as string) ?? ""} onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={form.current} className="input-dark w-full disabled:opacity-40" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
            <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked })} className="accent-primary" />
            Currently working here
          </label>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input-dark w-full resize-none" placeholder="Describe your role and responsibilities..." />
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2">
              <Check size={14} /> {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={cancelEdit} className="btn-secondary flex items-center gap-2">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <div className="glass-card p-16 text-center">
          <Briefcase size={40} className="mx-auto mb-4 text-muted-foreground opacity-30" />
          <p className="text-muted-foreground">No experience entries yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((exp) => (
            <div key={exp.id} className="glass-card p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground">{exp.position}</h3>
                <p className="text-primary text-sm">{exp.company}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                  {exp.location && ` · ${exp.location}`}
                </p>
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{exp.description}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(exp)} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                  <Pencil size={14} />
                </button>
                <button onClick={() => remove(exp.id)} className="p-2 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-400/10 transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
