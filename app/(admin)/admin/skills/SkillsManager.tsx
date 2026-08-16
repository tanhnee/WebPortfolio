"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Save } from "lucide-react";
import type { Skill } from "@/types";

const CATEGORIES = ["Business", "Technology", "Data", "AI"];

export function SkillsManager({ skills: initialSkills }: { skills: Skill[] }) {
  const router = useRouter();
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState({ name: "", category: "Business", level: 80 });
  const [saving, setSaving] = useState(false);

  const addSkill = async () => {
    if (!newSkill.name.trim()) return;
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSkill),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setSkills([...skills, created]);
      setNewSkill({ name: "", category: "Business", level: 80 });
      toast.success("Skill added!");
    } catch {
      toast.error("Failed to add skill");
    }
  };

  const removeSkill = async (id: string) => {
    try {
      await fetch(`/api/skills/${id}`, { method: "DELETE" });
      setSkills(skills.filter((s) => s.id !== id));
      toast.success("Skill removed");
    } catch {
      toast.error("Failed to remove skill");
    }
  };

  const grouped = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = skills.filter((s) => s.category === cat);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="space-y-6">
      {/* Add new skill */}
      <div className="glass-card p-6">
        <h3 className="text-base font-semibold text-foreground mb-4">Add New Skill</h3>
        <div className="flex gap-3 flex-wrap">
          <input
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
            placeholder="Skill name"
            className="input-dark flex-1 min-w-40"
          />
          <select
            value={newSkill.category}
            onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
            className="input-dark"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} style={{ background: "#0E1628" }}>{c}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={0}
              max={100}
              value={newSkill.level}
              onChange={(e) => setNewSkill({ ...newSkill, level: Number(e.target.value) })}
              className="w-24 accent-primary"
            />
            <span className="text-sm text-muted-foreground w-8">{newSkill.level}%</span>
          </div>
          <button onClick={addSkill} className="btn-primary flex items-center gap-2">
            <Plus size={14} /> Add
          </button>
        </div>
      </div>

      {/* Skills by category */}
      {CATEGORIES.map((cat) => (
        <div key={cat} className="glass-card p-6">
          <h3 className="text-base font-semibold text-foreground mb-4">{cat}</h3>
          {grouped[cat].length === 0 ? (
            <p className="text-sm text-muted-foreground">No skills in this category</p>
          ) : (
            <div className="space-y-3">
              {grouped[cat].map((skill) => (
                <div key={skill.id} className="flex items-center gap-3">
                  <span className="text-sm text-foreground/80 w-40 flex-shrink-0">{skill.name}</span>
                  <div className="flex-1 skill-bar">
                    <div className="skill-fill" style={{ width: `${skill.level}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">{skill.level}%</span>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="text-muted-foreground hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
