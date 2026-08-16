"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  value?: string | null;
  onUpload: (url: string) => Promise<void>;
  label?: string;
  accept?: string;
  previewRound?: boolean;
}

export function ImageUpload({ value, onUpload, label = "Upload Image", accept = "image/*", previewRound = false }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload-image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Upload failed");
      await onUpload(data.url);
      setPreview(data.url);
      toast.success("Uploaded!");
    } catch (err) {
      toast.error("Upload failed. Check Supabase Storage bucket.");
      setPreview(value || null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Preview */}
      {preview && (
        <div className="relative flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className={`w-16 h-16 object-cover border border-primary/30 ${previewRound ? "rounded-full" : "rounded-lg"}`} />
          {uploading && (
            <div className="absolute inset-0 bg-background/70 flex items-center justify-center rounded-full">
              <Loader2 size={16} className="animate-spin text-primary" />
            </div>
          )}
        </div>
      )}

      {/* Upload button */}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary text-xs hover:bg-primary/10 transition-colors disabled:opacity-50"
        >
          {uploading ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
          {uploading ? "Uploading..." : label}
        </button>
        {value && (
          <p className="text-xs text-muted-foreground/50 truncate max-w-[200px]">{value.split("/").pop()}</p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />
    </div>
  );
}
