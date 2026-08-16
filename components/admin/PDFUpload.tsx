"use client";

import { useRef, useState } from "react";
import { Upload, FileText, X, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface PDFUploadProps {
  value?: string | null;
  onUpload: (url: string) => void;
}

export function PDFUpload({ value, onUpload }: PDFUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files allowed");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File too large (max 20MB)");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload-pdf", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error);
      onUpload(data.url);
      toast.success("PDF uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const filename = value ? value.split("/").pop()?.split("?")[0] : null;

  return (
    <div className="space-y-2">
      {value && (
        <div className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5">
          <FileText size={18} className="text-primary flex-shrink-0" />
          <span className="text-sm text-foreground flex-1 truncate">{filename}</span>
          <a href={value} target="_blank" rel="noreferrer" className="text-primary hover:opacity-80">
            <ExternalLink size={14} />
          </a>
          <button
            type="button"
            onClick={() => onUpload("")}
            className="text-muted-foreground hover:text-red-400"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/30 bg-primary/5 text-primary text-sm hover:bg-primary/10 transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <><Loader2 size={14} className="animate-spin" /> Uploading...</>
          ) : (
            <><Upload size={14} /> {value ? "Replace PDF" : "Upload PDF"}</>
          )}
        </button>
        <span className="text-xs text-muted-foreground/50">Max 20MB · PDF only</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
