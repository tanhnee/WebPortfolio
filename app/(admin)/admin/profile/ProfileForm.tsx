"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";
import type { Profile } from "@/types";

const profileSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  bio: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  location: z.string().optional(),
  avatarUrl: z.string().optional(),
  cvUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
  website: z.string().optional(),
});

type FormData = z.infer<typeof profileSchema>;

export function ProfileForm({ profile }: { profile: Profile }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      email: profile.email,
      phone: profile.phone ?? "",
      location: profile.location ?? "",
      avatarUrl: profile.avatarUrl ?? "",
      cvUrl: profile.cvUrl ?? "",
      linkedinUrl: profile.linkedinUrl ?? "",
      githubUrl: profile.githubUrl ?? "",
      facebookUrl: profile.facebookUrl ?? "",
      website: profile.website ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Profile updated successfully!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const Field = ({
    label,
    name,
    type = "text",
    placeholder,
  }: {
    label: string;
    name: keyof FormData;
    type?: string;
    placeholder?: string;
  }) => (
    <div>
      <label className="block text-sm text-muted-foreground mb-1.5">{label}</label>
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className="input-dark w-full"
      />
      {errors[name] && (
        <p className="text-red-400 text-xs mt-1">{errors[name]?.message}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="glass-card p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground pb-3 border-b border-white/5">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full Name" name="name" placeholder="Le Buu Tanh" />
          <Field label="Email" name="email" type="email" placeholder="email@example.com" />
        </div>
        <Field label="Professional Title" name="title" placeholder="Business Analyst | Data Analyst..." />
        <div>
          <label className="block text-sm text-muted-foreground mb-1.5">Bio</label>
          <textarea
            {...register("bio")}
            rows={4}
            className="input-dark w-full resize-none"
            placeholder="Your professional biography..."
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Phone" name="phone" placeholder="+84 35 579 2919" />
          <Field label="Location" name="location" placeholder="Ho Chi Minh City, Vietnam" />
        </div>
      </div>

      <div className="glass-card p-6 space-y-4">
        <h3 className="text-base font-semibold text-foreground pb-3 border-b border-white/5">
          Links & URLs
        </h3>
        <Field label="Avatar URL" name="avatarUrl" placeholder="https://..." />
        <Field label="CV / Resume URL" name="cvUrl" placeholder="https://..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="LinkedIn URL" name="linkedinUrl" placeholder="https://linkedin.com/in/..." />
          <Field label="GitHub URL" name="githubUrl" placeholder="https://github.com/..." />
          <Field label="Facebook URL" name="facebookUrl" placeholder="https://facebook.com/..." />
          <Field label="Website" name="website" placeholder="https://..." />
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary flex items-center gap-2">
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Saving...
          </>
        ) : (
          <>
            <Save size={16} /> Save Profile
          </>
        )}
      </button>
    </form>
  );
}
