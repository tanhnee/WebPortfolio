"use client";

import { useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { ImageIcon, X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface GalleryImage {
  id: string;
  url: string;
  caption?: string | null;
  order: number;
}

interface GalleryUploadProps {
  projectId: string;
  images: GalleryImage[];
  onImagesChange: (images: GalleryImage[]) => void;
}

export function GalleryUpload({ projectId, images, onImagesChange }: GalleryUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    setError("");
    setUploading(true);

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 10 * 1024 * 1024) { setError("Max 10MB per image"); continue; }

      const ext = file.name.split(".").pop();
      const filename = `projects/${projectId}/gallery-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio")
        .upload(filename, file, { upsert: true, contentType: file.type });

      if (uploadError) { setError(uploadError.message); continue; }

      const { data: { publicUrl } } = supabase.storage.from("portfolio").getPublicUrl(filename);

      const res = await fetch(`/api/projects/${projectId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: publicUrl }),
      });

      if (res.ok) {
        const newImage = await res.json();
        onImagesChange([...images, newImage]);
      }
    }

    setUploading(false);
  };

  const handleDelete = async (imageId: string) => {
    const res = await fetch(`/api/projects/${projectId}/images`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId }),
    });
    if (res.ok) {
      onImagesChange(images.filter((img) => img.id !== imageId));
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        className="border-2 border-dashed border-white/10 hover:border-primary/40 rounded-xl p-6 text-center cursor-pointer transition-colors"
      >
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 size={16} className="animate-spin" /> Uploading...
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload size={20} />
            <p className="text-sm">Click or drag images here</p>
            <p className="text-xs opacity-60">PNG, JPG, WebP — max 10MB each</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Grid preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img) => (
            <div key={img.id} className="relative group aspect-video rounded-lg overflow-hidden border border-white/10">
              <Image src={img.url} alt={img.caption || "Gallery"} fill className="object-cover" />
              <button
                type="button"
                onClick={() => handleDelete(img.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-red-500/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && !uploading && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground/50">
          <ImageIcon size={12} /> No gallery images yet
        </div>
      )}
    </div>
  );
}
