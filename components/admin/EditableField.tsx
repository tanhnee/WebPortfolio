"use client";

import { useState, useRef, useEffect } from "react";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";

interface EditableFieldProps {
  value: string;
  onSave: (val: string) => Promise<void>;
  multiline?: boolean;
  className?: string;
  placeholder?: string;
  renderValue?: (val: string) => React.ReactNode;
}

export function EditableField({ value, onSave, multiline = false, className = "", placeholder = "Click to edit...", renderValue }: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing) inputRef.current?.focus(); }, [editing]);

  const handleSave = async () => {
    if (draft === value) { setEditing(false); return; }
    setSaving(true);
    try {
      await onSave(draft);
      toast.success("Saved!");
      setEditing(false);
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => { setDraft(value); setEditing(false); };

  if (editing) {
    return (
      <span className="inline-flex items-start gap-2 w-full">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={4}
            className={`flex-1 bg-card border border-primary/40 rounded px-2 py-1 text-foreground text-sm focus:outline-none focus:border-primary resize-y min-h-[80px] ${className}`}
            onKeyDown={(e) => { if (e.key === "Escape") handleCancel(); }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className={`flex-1 bg-card border border-primary/40 rounded px-2 py-1 text-foreground text-sm focus:outline-none focus:border-primary ${className}`}
            onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") handleCancel(); }}
          />
        )}
        <button onClick={handleSave} disabled={saving} className="mt-1 p-1 rounded bg-primary/20 hover:bg-primary/40 text-primary flex-shrink-0">
          <Check size={14} />
        </button>
        <button onClick={handleCancel} className="mt-1 p-1 rounded bg-white/5 hover:bg-white/10 text-muted-foreground flex-shrink-0">
          <X size={14} />
        </button>
      </span>
    );
  }

  return (
    <span
      className="group relative inline-flex items-start gap-1.5 cursor-pointer hover:text-foreground transition-colors"
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      <span className={className}>
        {value ? (renderValue ? renderValue(value) : value) : <span className="text-muted-foreground/40 italic">{placeholder}</span>}
      </span>
      <Pencil size={12} className="opacity-0 group-hover:opacity-70 text-primary flex-shrink-0 mt-1 transition-opacity" />
    </span>
  );
}
