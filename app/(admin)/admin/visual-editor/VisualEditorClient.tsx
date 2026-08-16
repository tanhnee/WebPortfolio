"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Check, X, ChevronDown, ChevronUp, Eye, FileText } from "lucide-react";
import { EditableField } from "@/components/admin/EditableField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { ImageCropUpload } from "@/components/admin/ImageCropUpload";
import Link from "next/link";

// ─── Types (matching Prisma schema exactly) ───────────────────────────────────
interface Profile {
  id: string; name: string; title?: string | null; bio?: string | null; summary?: string | null;
  email: string; phone?: string | null; location?: string | null;
  linkedinUrl?: string | null; githubUrl?: string | null; cvUrl?: string | null; avatarUrl?: string | null;
}
interface Skill { id: string; name: string; category: string; level: number; order: number; }
interface Experience {
  id: string; company: string; position: string; type: string; description: string;
  startDate: string; endDate?: string | null; current: boolean; location?: string | null; order: number;
}
interface Research {
  id: string; title: string; journal?: string | null; conference?: string | null;
  authors: string[]; abstract: string; doi?: string | null; pdfUrl?: string | null;
  publishedAt?: string | null; status: string; tags: string[];
}
interface Education {
  id: string; school: string; degree: string; major: string; gpa?: string | null;
  startDate: string; endDate?: string | null; current: boolean; description?: string | null; order: number;
}
interface Project {
  id: string; title: string; description: string; tags: string[]; featured: boolean;
  githubUrl?: string | null; demoUrl?: string | null; pdfUrl?: string | null; coverUrl?: string | null;
  category: string; status: string; slug: string;
}
interface Award { id: string; title: string; issuer: string; description?: string | null; date: string; order: number; }

interface Props {
  initialProfile: Profile | null;
  initialSkills: Skill[];
  initialExperiences: Experience[];
  initialResearch: Research[];
  initialEducation: Education[];
  initialProjects: Project[];
  initialAwards: Award[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function apiPut(path: string, data: Record<string, unknown>) {
  const res = await fetch(path, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}
async function apiPost(path: string, data: Record<string, unknown>) {
  const res = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  if (!res.ok) throw new Error("Failed");
  return res.json();
}
async function apiDelete(path: string) {
  const res = await fetch(path, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed");
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ id, label, children, defaultOpen = true }: { id: string; label: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div id={id} className="border border-white/10 rounded-xl overflow-hidden mb-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-3 bg-card/60 hover:bg-card text-left">
        <span className="font-semibold text-foreground text-sm tracking-wide">{label}</span>
        {open ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
      </button>
      {open && <div className="p-5 bg-background/40">{children}</div>}
    </div>
  );
}

function FieldRow({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
      <div className="w-32 flex-shrink-0 pt-0.5">
        <span className="text-xs text-muted-foreground">{label}</span>
        {hint && <p className="text-xs text-muted-foreground/40 mt-0.5 leading-tight">{hint}</p>}
      </div>
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}

function InlineForm({ fields, onSave, onCancel }: {
  fields: { key: string; label: string; multiline?: boolean; type?: string; hint?: string }[];
  onSave: (data: Record<string, string>) => Promise<void>;
  onCancel: () => void;
}) {
  const [data, setData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  return (
    <div className="border border-primary/20 rounded-lg p-4 bg-primary/5 space-y-3 mt-3">
      {fields.map((f) => (
        <div key={f.key}>
          <label className="text-xs text-muted-foreground mb-1 block">{f.label}{f.hint && <span className="text-muted-foreground/40 ml-1">({f.hint})</span>}</label>
          {f.multiline ? (
            <textarea rows={3} value={data[f.key] || ""} onChange={(e) => setData({ ...data, [f.key]: e.target.value })} className="input-dark w-full text-sm resize-y" />
          ) : (
            <input type={f.type || "text"} value={data[f.key] || ""} onChange={(e) => setData({ ...data, [f.key]: e.target.value })} className="input-dark w-full text-sm" />
          )}
        </div>
      ))}
      <div className="flex gap-2">
        <button onClick={async () => { setSaving(true); try { await onSave(data); } catch { toast.error("Failed"); } finally { setSaving(false); } }} disabled={saving} className="btn-primary text-xs flex items-center gap-1 py-1.5 px-3">
          <Check size={12} /> {saving ? "Saving..." : "Save"}
        </button>
        <button onClick={onCancel} className="btn-secondary text-xs flex items-center gap-1 py-1.5 px-3">
          <X size={12} /> Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function VisualEditorClient({ initialProfile, initialSkills, initialExperiences, initialResearch, initialEducation, initialProjects, initialAwards }: Props) {
  const [profile, setProfile] = useState(initialProfile);
  const [skills, setSkills] = useState(initialSkills);
  const [experiences, setExperiences] = useState(initialExperiences);
  const [research, setResearch] = useState(initialResearch);
  const [education, setEducation] = useState(initialEducation);
  const [projects, setProjects] = useState(initialProjects);
  const [awards, setAwards] = useState(initialAwards);

  const [addingSkill, setAddingSkill] = useState(false);
  const [addingExp, setAddingExp] = useState(false);
  const [addingResearch, setAddingResearch] = useState(false);
  const [addingEdu, setAddingEdu] = useState(false);
  const [addingProject, setAddingProject] = useState(false);
  const [addingAward, setAddingAward] = useState(false);

  const saveProfile = async (field: string, val: string) => {
    if (!profile) return;
    const updated = { ...profile, [field]: val };
    await apiPut(`/api/profile`, updated);
    setProfile(updated);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold gradient-text-cyan">Visual Editor</h1>
          <p className="text-muted-foreground text-sm mt-1">Click any value to edit. Press Enter or ✓ to save.</p>
        </div>
        <Link href="/" target="_blank" className="btn-secondary flex items-center gap-2 text-sm">
          <Eye size={14} /> Preview Site
        </Link>
      </div>

      {/* ── HERO ─── */}
      <Section id="hero" label="🏠 Hero Section">
        <FieldRow label="Full Name">
          <EditableField value={profile?.name || ""} onSave={(v) => saveProfile("name", v)} className="font-semibold text-foreground" />
        </FieldRow>
        <FieldRow label="Roles / Titles" hint="Separate with |, rotates in typing effect">
          <EditableField value={profile?.title || ""} onSave={(v) => saveProfile("title", v)} placeholder="Business Analyst | Data Analyst" className="text-sm text-muted-foreground" />
        </FieldRow>
        <FieldRow label="Hero Tagline" hint="1-2 sentences shown on hero">
          <EditableField value={profile?.summary || ""} onSave={(v) => saveProfile("summary", v)} multiline placeholder="Short intro shown on hero (1-2 sentences)..." className="text-sm text-muted-foreground" />
        </FieldRow>
        <FieldRow label="Avatar Photo">
          <ImageCropUpload
            value={profile?.avatarUrl}
            onUpload={async (url) => { await saveProfile("avatarUrl", url); }}
            label="Upload & Crop Photo"
            shape="round"
            aspect={1}
          />
        </FieldRow>
        <FieldRow label="CV / Resume" hint="Upload PDF or paste Google Drive link">
          <div className="flex flex-col gap-2">
            <ImageUpload
              value={profile?.cvUrl}
              onUpload={async (url) => { await saveProfile("cvUrl", url); }}
              label="Upload CV (PDF)"
              accept=".pdf,application/pdf"
            />
            <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
              <span>or paste URL:</span>
              <EditableField value={profile?.cvUrl || ""} onSave={(v) => saveProfile("cvUrl", v)} placeholder="https://drive.google.com/..." className="text-sm text-primary" />
            </div>
          </div>
        </FieldRow>
      </Section>

      {/* ── ABOUT ─── */}
      <Section id="about" label="👤 About Section">
        <FieldRow label="Full Bio" hint="All paragraphs shown in About">
          <EditableField value={profile?.bio || ""} onSave={(v) => saveProfile("bio", v)} multiline className="text-sm text-muted-foreground whitespace-pre-wrap" />
        </FieldRow>
        <FieldRow label="Email">
          <EditableField value={profile?.email || ""} onSave={(v) => saveProfile("email", v)} className="text-sm" />
        </FieldRow>
        <FieldRow label="Phone">
          <EditableField value={profile?.phone || ""} onSave={(v) => saveProfile("phone", v)} className="text-sm" />
        </FieldRow>
        <FieldRow label="Location">
          <EditableField value={profile?.location || ""} onSave={(v) => saveProfile("location", v)} className="text-sm" />
        </FieldRow>
        <FieldRow label="LinkedIn URL">
          <EditableField value={profile?.linkedinUrl || ""} onSave={(v) => saveProfile("linkedinUrl", v)} className="text-sm text-primary" />
        </FieldRow>
        <FieldRow label="GitHub URL">
          <EditableField value={profile?.githubUrl || ""} onSave={(v) => saveProfile("githubUrl", v)} className="text-sm text-primary" />
        </FieldRow>
      </Section>

      {/* ── EDUCATION ─── */}
      <Section id="education" label="🎓 Education">
        {education.map((edu) => {
          const save = async (field: string, val: string) => {
            await apiPut(`/api/education/${edu.id}`, { ...edu, [field]: val });
            setEducation(education.map((e) => e.id === edu.id ? { ...e, [field]: val } : e));
          };
          return (
            <div key={edu.id} className="border border-white/10 rounded-lg p-4 mb-3 bg-card/30">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-0">
                  <FieldRow label="School"><EditableField value={edu.school} onSave={(v) => save("school", v)} className="font-semibold text-foreground text-sm" /></FieldRow>
                  <FieldRow label="Degree"><EditableField value={edu.degree} onSave={(v) => save("degree", v)} className="text-sm" /></FieldRow>
                  <FieldRow label="Major"><EditableField value={edu.major} onSave={(v) => save("major", v)} className="text-sm" /></FieldRow>
                  <FieldRow label="GPA"><EditableField value={edu.gpa || ""} onSave={(v) => save("gpa", v)} className="text-sm text-primary" /></FieldRow>
                  <FieldRow label="Description"><EditableField value={edu.description || ""} onSave={(v) => save("description", v)} multiline className="text-sm text-muted-foreground" /></FieldRow>
                </div>
                <button onClick={async () => { await apiDelete(`/api/education/${edu.id}`); setEducation(education.filter((e) => e.id !== edu.id)); toast.success("Deleted"); }} className="ml-3 p-1.5 rounded text-red-400 hover:bg-red-400/10 flex-shrink-0 mt-1">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
        {addingEdu ? (
          <InlineForm
            fields={[{ key: "school", label: "School" }, { key: "degree", label: "Degree" }, { key: "major", label: "Major" }, { key: "gpa", label: "GPA" }, { key: "startDate", label: "Start Date", type: "date" }, { key: "description", label: "Description", multiline: true }]}
            onSave={async (data) => { const created = await apiPost("/api/education", { ...data, current: true, order: education.length }); setEducation([...education, created]); setAddingEdu(false); toast.success("Added!"); }}
            onCancel={() => setAddingEdu(false)}
          />
        ) : (
          <button onClick={() => setAddingEdu(true)} className="w-full mt-2 py-2 border border-dashed border-primary/30 rounded-lg text-primary/60 hover:text-primary hover:border-primary/60 text-sm flex items-center justify-center gap-2 transition-colors">
            <Plus size={14} /> Add Education
          </button>
        )}
      </Section>

      {/* ── AWARDS ─── */}
      <Section id="awards" label="🏆 Awards">
        {awards.map((award) => {
          const save = async (field: string, val: string) => {
            await apiPut(`/api/awards/${award.id}`, { ...award, [field]: val });
            setAwards(awards.map((a) => a.id === award.id ? { ...a, [field]: val } : a));
          };
          const year = award.date ? new Date(award.date).getFullYear().toString() : "";
          return (
            <div key={award.id} className="border border-white/10 rounded-lg p-4 mb-3 bg-card/30 flex justify-between items-start">
              <div className="flex-1 space-y-0">
                <FieldRow label="Title"><EditableField value={award.title} onSave={(v) => save("title", v)} className="font-semibold text-foreground text-sm" /></FieldRow>
                <FieldRow label="Issuer"><EditableField value={award.issuer} onSave={(v) => save("issuer", v)} className="text-sm text-muted-foreground" /></FieldRow>
                <FieldRow label="Year" hint="e.g. 2024"><EditableField value={year} onSave={async (v) => { const date = new Date(`${v}-01-01`).toISOString(); await apiPut(`/api/awards/${award.id}`, { ...award, date }); setAwards(awards.map((a) => a.id === award.id ? { ...a, date } : a)); }} className="text-sm text-primary" /></FieldRow>
                <FieldRow label="Description"><EditableField value={award.description || ""} onSave={(v) => save("description", v)} multiline className="text-sm text-muted-foreground" /></FieldRow>
              </div>
              <button onClick={async () => { await apiDelete(`/api/awards/${award.id}`); setAwards(awards.filter((a) => a.id !== award.id)); toast.success("Deleted"); }} className="ml-3 p-1.5 rounded text-red-400 hover:bg-red-400/10 flex-shrink-0 mt-1">
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
        {addingAward ? (
          <InlineForm
            fields={[{ key: "title", label: "Award Title" }, { key: "issuer", label: "Issuer / Organization" }, { key: "date", label: "Date", type: "date" }, { key: "description", label: "Description", multiline: true }]}
            onSave={async (data) => { const created = await apiPost("/api/awards", { ...data, order: awards.length }); setAwards([...awards, created]); setAddingAward(false); toast.success("Added!"); }}
            onCancel={() => setAddingAward(false)}
          />
        ) : (
          <button onClick={() => setAddingAward(true)} className="w-full mt-2 py-2 border border-dashed border-primary/30 rounded-lg text-primary/60 hover:text-primary hover:border-primary/60 text-sm flex items-center justify-center gap-2 transition-colors">
            <Plus size={14} /> Add Award
          </button>
        )}
      </Section>

      {/* ── EXPERIENCE ─── */}
      <Section id="experience" label="💼 Experience">
        {experiences.map((exp) => {
          const save = async (field: string, val: string) => {
            await apiPut(`/api/experiences/${exp.id}`, { ...exp, [field]: val });
            setExperiences(experiences.map((e) => e.id === exp.id ? { ...e, [field]: val } : e));
          };
          return (
            <div key={exp.id} className="border border-white/10 rounded-lg p-4 mb-3 bg-card/30 flex justify-between items-start">
              <div className="flex-1 space-y-0">
                <FieldRow label="Position"><EditableField value={exp.position} onSave={(v) => save("position", v)} className="font-semibold text-foreground text-sm" /></FieldRow>
                <FieldRow label="Company"><EditableField value={exp.company} onSave={(v) => save("company", v)} className="text-sm text-primary" /></FieldRow>
                <FieldRow label="Type" hint="work / research / leadership / volunteer"><EditableField value={exp.type} onSave={(v) => save("type", v)} className="text-sm" /></FieldRow>
                <FieldRow label="Location"><EditableField value={exp.location || ""} onSave={(v) => save("location", v)} className="text-sm text-muted-foreground" /></FieldRow>
                <FieldRow label="Description"><EditableField value={exp.description} onSave={(v) => save("description", v)} multiline className="text-sm text-muted-foreground" /></FieldRow>
              </div>
              <button onClick={async () => { await apiDelete(`/api/experiences/${exp.id}`); setExperiences(experiences.filter((e) => e.id !== exp.id)); toast.success("Deleted"); }} className="ml-3 p-1.5 rounded text-red-400 hover:bg-red-400/10 flex-shrink-0 mt-1">
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
        {addingExp ? (
          <InlineForm
            fields={[{ key: "position", label: "Position / Title" }, { key: "company", label: "Company / Organization" }, { key: "type", label: "Type", hint: "work / research / leadership / volunteer" }, { key: "location", label: "Location" }, { key: "startDate", label: "Start Date", type: "date" }, { key: "description", label: "Description", multiline: true }]}
            onSave={async (data) => { const created = await apiPost("/api/experiences", { ...data, current: true, order: experiences.length }); setExperiences([...experiences, created]); setAddingExp(false); toast.success("Added!"); }}
            onCancel={() => setAddingExp(false)}
          />
        ) : (
          <button onClick={() => setAddingExp(true)} className="w-full mt-2 py-2 border border-dashed border-primary/30 rounded-lg text-primary/60 hover:text-primary hover:border-primary/60 text-sm flex items-center justify-center gap-2 transition-colors">
            <Plus size={14} /> Add Experience
          </button>
        )}
      </Section>

      {/* ── SKILLS ─── */}
      <Section id="skills" label="🛠 Skills">
        {Object.entries(skills.reduce((acc, s) => { (acc[s.category] ??= []).push(s); return acc; }, {} as Record<string, Skill[]>)).map(([cat, catSkills]) => (
          <div key={cat} className="mb-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat}</p>
            <div className="flex flex-wrap gap-2">
              {catSkills.map((skill) => (
                <div key={skill.id} className="group flex items-center gap-1 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs">
                  <EditableField value={skill.name} onSave={async (v) => { await apiPut(`/api/skills/${skill.id}`, { ...skill, name: v }); setSkills(skills.map((s) => s.id === skill.id ? { ...s, name: v } : s)); }} className="text-primary text-xs" />
                  <button onClick={async () => { await apiDelete(`/api/skills/${skill.id}`); setSkills(skills.filter((s) => s.id !== skill.id)); toast.success("Deleted"); }} className="opacity-0 group-hover:opacity-100 text-red-400 ml-1 transition-opacity">
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {addingSkill ? (
          <InlineForm
            fields={[{ key: "name", label: "Skill Name" }, { key: "category", label: "Category", hint: "e.g. Programming, Tools, Soft Skills" }]}
            onSave={async (data) => { const created = await apiPost("/api/skills", { ...data, level: 80, order: skills.length }); setSkills([...skills, created]); setAddingSkill(false); toast.success("Added!"); }}
            onCancel={() => setAddingSkill(false)}
          />
        ) : (
          <button onClick={() => setAddingSkill(true)} className="w-full mt-2 py-2 border border-dashed border-primary/30 rounded-lg text-primary/60 hover:text-primary hover:border-primary/60 text-sm flex items-center justify-center gap-2 transition-colors">
            <Plus size={14} /> Add Skill
          </button>
        )}
      </Section>

      {/* ── PROJECTS ─── */}
      <Section id="projects" label="🚀 Projects" defaultOpen={false}>
        {projects.map((proj) => {
          const save = async (field: string, val: unknown) => {
            await apiPut(`/api/projects/${proj.id}`, { ...proj, [field]: val });
            setProjects(projects.map((p) => p.id === proj.id ? { ...p, [field]: val } : p));
          };
          return (
            <div key={proj.id} className="border border-white/10 rounded-lg p-4 mb-3 bg-card/30 flex justify-between items-start">
              <div className="flex-1 space-y-0">
                <FieldRow label="Title"><EditableField value={proj.title} onSave={(v) => save("title", v)} className="font-semibold text-foreground text-sm" /></FieldRow>
                <FieldRow label="Description"><EditableField value={proj.description} onSave={(v) => save("description", v)} multiline className="text-sm text-muted-foreground" /></FieldRow>
                <FieldRow label="Tags" hint="comma-separated"><EditableField value={proj.tags.join(", ")} onSave={async (v) => { const tags = v.split(",").map((t) => t.trim()).filter(Boolean); await save("tags", tags); }} className="text-xs text-muted-foreground" /></FieldRow>
                <FieldRow label="Category"><EditableField value={proj.category} onSave={(v) => save("category", v)} className="text-sm" /></FieldRow>
                <FieldRow label="GitHub URL"><EditableField value={proj.githubUrl || ""} onSave={(v) => save("githubUrl", v)} className="text-sm text-primary" /></FieldRow>
                <FieldRow label="Demo URL"><EditableField value={proj.demoUrl || ""} onSave={(v) => save("demoUrl", v)} className="text-sm text-primary" /></FieldRow>
                <FieldRow label="Document PDF">
                  <ImageUpload
                    value={proj.pdfUrl || undefined}
                    onUpload={async (url) => { await save("pdfUrl", url); }}
                    label="Upload PDF"
                    accept=".pdf,application/pdf"
                  />
                  {proj.pdfUrl && (
                    <a href={proj.pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-1 text-xs text-primary flex items-center gap-1 hover:underline">
                      <FileText size={11} /> View current PDF
                    </a>
                  )}
                </FieldRow>
                <FieldRow label="Cover Image">
                  <ImageCropUpload
                    value={proj.coverUrl || undefined}
                    onUpload={async (url) => { await save("coverUrl", url); }}
                    label="Upload & Crop Cover"
                    shape="rect"
                    aspect={16 / 9}
                  />
                </FieldRow>
                <FieldRow label="Featured">
                  <button onClick={() => save("featured", !proj.featured)} className={`text-xs px-2 py-0.5 rounded transition-colors ${proj.featured ? "bg-primary/20 text-primary border border-primary/30" : "bg-white/5 text-muted-foreground border border-white/10 hover:border-primary/30"}`}>
                    {proj.featured ? "⭐ Featured" : "Not featured — click to feature"}
                  </button>
                </FieldRow>
              </div>
              <button onClick={async () => { await apiDelete(`/api/projects/${proj.id}`); setProjects(projects.filter((p) => p.id !== proj.id)); toast.success("Deleted"); }} className="ml-3 p-1.5 rounded text-red-400 hover:bg-red-400/10 flex-shrink-0 mt-1">
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
        {addingProject ? (
          <InlineForm
            fields={[{ key: "title", label: "Project Title" }, { key: "category", label: "Category", hint: "e.g. AI, Web, Data" }, { key: "description", label: "Description", multiline: true }, { key: "tags", label: "Tags", hint: "comma-separated" }, { key: "githubUrl", label: "GitHub URL" }, { key: "demoUrl", label: "Demo/Live URL" }]}
            onSave={async (data) => {
              const tags = (data.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
              const slug = data.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();
              const created = await apiPost("/api/projects", { ...data, tags, slug, featured: false, status: "completed" });
              setProjects([...projects, created]);
              setAddingProject(false);
              toast.success("Added!");
            }}
            onCancel={() => setAddingProject(false)}
          />
        ) : (
          <button onClick={() => setAddingProject(true)} className="w-full mt-2 py-2 border border-dashed border-primary/30 rounded-lg text-primary/60 hover:text-primary hover:border-primary/60 text-sm flex items-center justify-center gap-2 transition-colors">
            <Plus size={14} /> Add Project
          </button>
        )}
      </Section>

      {/* ── RESEARCH ─── */}
      <Section id="research" label="📄 Research Papers" defaultOpen={false}>
        {research.map((r) => {
          const save = async (field: string, val: string) => {
            await apiPut(`/api/research/${r.id}`, { ...r, [field]: val });
            setResearch(research.map((x) => x.id === r.id ? { ...x, [field]: val } : x));
          };
          return (
            <div key={r.id} className="border border-white/10 rounded-lg p-4 mb-3 bg-card/30 flex justify-between items-start">
              <div className="flex-1 space-y-0">
                <FieldRow label="Title"><EditableField value={r.title} onSave={(v) => save("title", v)} className="font-semibold text-foreground text-sm" /></FieldRow>
                <FieldRow label="Journal"><EditableField value={r.journal || ""} onSave={(v) => save("journal", v)} className="text-sm text-muted-foreground" /></FieldRow>
                <FieldRow label="Conference"><EditableField value={r.conference || ""} onSave={(v) => save("conference", v)} className="text-sm text-muted-foreground" /></FieldRow>
                <FieldRow label="Authors" hint="comma-separated"><EditableField value={r.authors.join(", ")} onSave={async (v) => { const authors = v.split(",").map((a) => a.trim()).filter(Boolean); await apiPut(`/api/research/${r.id}`, { ...r, authors }); setResearch(research.map((x) => x.id === r.id ? { ...x, authors } : x)); }} className="text-sm text-muted-foreground" /></FieldRow>
                <FieldRow label="Abstract"><EditableField value={r.abstract} onSave={(v) => save("abstract", v)} multiline className="text-sm text-muted-foreground" /></FieldRow>
                <FieldRow label="DOI / URL"><EditableField value={r.doi || ""} onSave={(v) => save("doi", v)} className="text-sm text-primary" /></FieldRow>
                <FieldRow label="PDF File">
                  <ImageUpload
                    value={r.pdfUrl || undefined}
                    onUpload={async (url) => { await apiPut(`/api/research/${r.id}`, { ...r, pdfUrl: url }); setResearch(research.map((x) => x.id === r.id ? { ...x, pdfUrl: url } : x)); }}
                    label="Upload PDF"
                    accept=".pdf,application/pdf"
                  />
                  {r.pdfUrl && (
                    <a href={r.pdfUrl} target="_blank" rel="noopener noreferrer" className="mt-1 text-xs text-primary flex items-center gap-1 hover:underline">
                      <FileText size={11} /> View current PDF
                    </a>
                  )}
                </FieldRow>
              </div>
              <button onClick={async () => { await apiDelete(`/api/research/${r.id}`); setResearch(research.filter((x) => x.id !== r.id)); toast.success("Deleted"); }} className="ml-3 p-1.5 rounded text-red-400 hover:bg-red-400/10 flex-shrink-0 mt-1">
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
        {addingResearch ? (
          <InlineForm
            fields={[{ key: "title", label: "Paper Title" }, { key: "journal", label: "Journal" }, { key: "conference", label: "Conference" }, { key: "authors", label: "Authors", hint: "comma-separated" }, { key: "abstract", label: "Abstract", multiline: true }, { key: "doi", label: "DOI / URL" }, { key: "publishedAt", label: "Published Date", type: "date" }]}
            onSave={async (data) => {
              const authors = (data.authors || "").split(",").map((a) => a.trim()).filter(Boolean);
              const tags: string[] = [];
              const created = await apiPost("/api/research", { ...data, authors, tags, status: "published" });
              setResearch([...research, created]);
              setAddingResearch(false);
              toast.success("Added!");
            }}
            onCancel={() => setAddingResearch(false)}
          />
        ) : (
          <button onClick={() => setAddingResearch(true)} className="w-full mt-2 py-2 border border-dashed border-primary/30 rounded-lg text-primary/60 hover:text-primary hover:border-primary/60 text-sm flex items-center justify-center gap-2 transition-colors">
            <Plus size={14} /> Add Research Paper
          </button>
        )}
      </Section>
    </div>
  );
}
