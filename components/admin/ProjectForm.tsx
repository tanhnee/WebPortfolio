"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { X, Plus, Save, Loader2 } from "lucide-react";
import { RichTextEditor } from "./RichTextEditor";
import { ImageCropUpload } from "./ImageCropUpload";
import { PDFUpload } from "./PDFUpload";
import { GalleryUpload } from "./GalleryUpload";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  subtitle: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  status: z.string().default("completed"),
  featured: z.boolean().default(false),
  coverUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  pdfUrl: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  abstract: z.string().optional(),
  problem: z.string().optional(),
  objectives: z.string().optional(),
  methodology: z.string().optional(),
  architecture: z.string().optional(),
  features: z.string().optional(),
  results: z.string().optional(),
  lessons: z.string().optional(),
  role: z.string().optional(),
  team: z.string().optional(),
  githubUrl: z.string().url().optional().or(z.literal("")),
  demoUrl: z.string().url().optional().or(z.literal("")),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  tags: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
});

type FormData = z.infer<typeof projectSchema>;

const CATEGORIES = ["AI", "Data Analytics", "Business Intelligence", "Web Development", "Research", "SCM", "Mobile Development", "Marketing Technology"];
const STATUSES = ["completed", "in-progress", "planned"];

interface ProjectFormProps {
  project?: Project;
}

function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInput("");
    }
  };

  const remove = (tag: string) => onChange(value.filter((t) => t !== tag));

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="input-dark flex-1 text-sm"
        />
        <button type="button" onClick={add} className="btn-secondary text-sm px-3 py-2">
          <Plus size={14} />
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {value.map((tag) => (
          <span key={tag} className="badge flex items-center gap-1.5">
            {tag}
            <button type="button" onClick={() => remove(tag)}>
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-6">
      <h3 className="text-base font-semibold text-foreground mb-4 pb-3 border-b border-white/5">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
  required,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-muted-foreground mb-1.5">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function ProjectForm({ project }: ProjectFormProps) {
  const router = useRouter();
  const isEdit = !!project;
  const [galleryImages, setGalleryImages] = useState<{ id: string; url: string; caption?: string | null; order: number }[]>(
    (project as any)?.images ?? []
  );

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project?.title ?? "",
      subtitle: project?.subtitle ?? "",
      category: project?.category ?? "AI",
      status: project?.status ?? "completed",
      featured: project?.featured ?? false,
      coverUrl: project?.coverUrl ?? "",
      pdfUrl: project?.pdfUrl ?? "",
      description: project?.description ?? "",
      abstract: project?.abstract ?? "",
      problem: project?.problem ?? "",
      objectives: project?.objectives ?? "",
      methodology: project?.methodology ?? "",
      architecture: project?.architecture ?? "",
      features: project?.features ?? "",
      results: project?.results ?? "",
      lessons: project?.lessons ?? "",
      role: project?.role ?? "",
      team: project?.team ?? "",
      githubUrl: project?.githubUrl ?? "",
      demoUrl: project?.demoUrl ?? "",
      startDate: project?.startDate
        ? new Date(project.startDate).toISOString().split("T")[0]
        : "",
      endDate: project?.endDate
        ? new Date(project.endDate).toISOString().split("T")[0]
        : "",
      tags: project?.tags ?? [],
      technologies: project?.technologies ?? [],
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const url = isEdit ? `/api/projects/${project.id}` : "/api/projects";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }

      toast.success(isEdit ? "Project updated!" : "Project created!");
      router.push("/admin/projects");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save project");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
      {/* Basic Info */}
      <FormSection title="Basic Information">
        <Field label="Title" error={errors.title?.message} required>
          <input {...register("title")} className="input-dark w-full" placeholder="Project title" />
        </Field>

        <Field label="Subtitle">
          <input {...register("subtitle")} className="input-dark w-full" placeholder="Short subtitle or tagline" />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Category" error={errors.category?.message} required>
            {(() => {
              const currentVal = watch("category");
              const isCustom = currentVal && !CATEGORIES.includes(currentVal);
              return (
                <div className="flex flex-col gap-1">
                  <select
                    value={isCustom ? "__custom__" : currentVal}
                    onChange={(e) => {
                      if (e.target.value === "__custom__") {
                        setValue("category", "");
                      } else {
                        setValue("category", e.target.value);
                      }
                    }}
                    className="input-dark w-full"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c} style={{ background: "#0E1628" }}>{c}</option>
                    ))}
                    <option value="__custom__" style={{ background: "#0E1628" }}>+ Custom...</option>
                  </select>
                  {(isCustom || currentVal === "") && (
                    <input
                      {...register("category")}
                      className="input-dark w-full"
                      placeholder="Type category name..."
                      autoFocus
                    />
                  )}
                </div>
              );
            })()}
          </Field>

          <Field label="Status">
            <select {...register("status")} className="input-dark w-full">
              {STATUSES.map((s) => (
                <option key={s} value={s} style={{ background: "#0E1628" }}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Featured">
            <div className="flex items-center gap-2 h-12">
              <input {...register("featured")} type="checkbox" id="featured" className="w-4 h-4 accent-primary" />
              <label htmlFor="featured" className="text-sm text-muted-foreground">
                Mark as featured
              </label>
            </div>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Start Date">
            <input {...register("startDate")} type="date" className="input-dark w-full" />
          </Field>
          <Field label="End Date">
            <input {...register("endDate")} type="date" className="input-dark w-full" />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Your Role">
            <input {...register("role")} className="input-dark w-full" placeholder="e.g. Lead Developer" />
          </Field>
          <Field label="Team">
            <input {...register("team")} className="input-dark w-full" placeholder="e.g. Solo / 4 people" />
          </Field>
        </div>
      </FormSection>

      {/* Media */}
      <FormSection title="Media & Links">
        <Field label="Cover Image">
          <Controller
            name="coverUrl"
            control={control}
            render={({ field }) => (
              <ImageCropUpload
                value={field.value}
                onUpload={async (url) => field.onChange(url)}
                label="Upload Cover Image"
                shape="rect"
                aspect={16 / 9}
              />
            )}
          />
        </Field>
        <Field label="PDF Document">
          <Controller
            name="pdfUrl"
            control={control}
            render={({ field }) => (
              <PDFUpload
                value={field.value}
                onUpload={(url) => field.onChange(url)}
              />
            )}
          />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="GitHub URL">
            <input {...register("githubUrl")} className="input-dark w-full" placeholder="https://github.com/..." />
          </Field>
          <Field label="Demo URL">
            <input {...register("demoUrl")} className="input-dark w-full" placeholder="https://..." />
          </Field>
        </div>
      </FormSection>

      {/* Tags & Technologies */}
      <FormSection title="Tags & Technologies">
        <Field label="Tags">
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="Add a tag..." />
            )}
          />
        </Field>
        <Field label="Technologies">
          <Controller
            name="technologies"
            control={control}
            render={({ field }) => (
              <TagInput value={field.value} onChange={field.onChange} placeholder="Add technology..." />
            )}
          />
        </Field>
      </FormSection>

      {/* Content */}
      <FormSection title="Content">
        <Field label="Description" error={errors.description?.message} required>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="Brief project description..."
            className="input-dark w-full resize-none"
          />
        </Field>

        {[
          { name: "abstract" as const, label: "Abstract" },
          { name: "problem" as const, label: "Problem Statement" },
          { name: "objectives" as const, label: "Objectives" },
          { name: "methodology" as const, label: "Methodology" },
          { name: "architecture" as const, label: "System Architecture" },
          { name: "features" as const, label: "Key Features" },
          { name: "results" as const, label: "Results & Outcomes" },
          { name: "lessons" as const, label: "Lessons Learned" },
        ].map(({ name, label }) => (
          <Field key={name} label={label}>
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <RichTextEditor
                  content={field.value ?? ""}
                  onChange={field.onChange}
                  placeholder={`Write ${label.toLowerCase()}...`}
                />
              )}
            />
          </Field>
        ))}
      </FormSection>

      {/* Gallery */}
      {isEdit && (
        <FormSection title="Gallery Images">
          <GalleryUpload
            projectId={project.id}
            images={galleryImages}
            onImagesChange={setGalleryImages}
          />
        </FormSection>
      )}

      {/* Submit */}
      <div className="flex items-center gap-4 sticky bottom-0 glass-nav p-4 -mx-8 -mb-8 px-8">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              {isEdit ? "Update Project" : "Create Project"}
            </>
          )}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
