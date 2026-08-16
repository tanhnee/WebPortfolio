"use client";

import { useRef, useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Upload, ZoomIn, ZoomOut, Check, X, Loader2, RotateCw } from "lucide-react";
import { toast } from "sonner";

// ─── Canvas crop helper ───────────────────────────────────────────────────────
interface CropArea { x: number; y: number; width: number; height: number; }

async function getCroppedBlob(imageSrc: string, cropArea: CropArea, shape: "round" | "rect"): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = imageSrc;
  });

  const canvas = document.createElement("canvas");
  const size = Math.min(cropArea.width, cropArea.height);
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  if (shape === "round") {
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();
  }

  ctx.drawImage(
    image,
    cropArea.x, cropArea.y, cropArea.width, cropArea.height,
    0, 0, size, size,
  );

  return new Promise((resolve) => canvas.toBlob((b) => resolve(b!), "image/jpeg", 0.92));
}

// ─── Main component ───────────────────────────────────────────────────────────
interface ImageCropUploadProps {
  value?: string | null;
  onUpload: (url: string) => Promise<void>;
  label?: string;
  shape?: "round" | "rect";
  aspect?: number;
}

export function ImageCropUpload({
  value,
  onUpload,
  label = "Upload Image",
  shape = "rect",
  aspect = 1,
}: ImageCropUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [src, setSrc] = useState<string | null>(null);          // raw file src for cropper
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);

  const onCropComplete = useCallback((_: unknown, pixels: CropArea) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result as string);
    reader.readAsDataURL(file);
    // reset
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  const handleConfirm = async () => {
    if (!src || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const blob = await getCroppedBlob(src, croppedAreaPixels, shape);
      const fd = new FormData();
      fd.append("file", blob, "image.jpg");
      const res = await fetch("/api/upload-image", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error);
      await onUpload(data.url);
      setPreview(data.url);
      setSrc(null);
      toast.success("Uploaded!");
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setSrc(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  // ── Crop modal ──────────────────────────────────────────────────────────────
  if (src) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-card border border-white/10 rounded-2xl w-full max-w-md shadow-2xl my-auto" style={{ maxHeight: "calc(100vh - 2rem)", overflowY: "auto" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
            <h3 className="font-semibold text-foreground text-sm">Crop & Position Image</h3>
            <button onClick={handleCancel} className="text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          </div>

          {/* Cropper canvas */}
          <div className="relative bg-black" style={{ height: 320 }}>
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              cropShape={shape === "round" ? "round" : "rect"}
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{
                containerStyle: { background: "#000" },
                cropAreaStyle: { border: "2px solid #00ff88" },
              }}
            />
          </div>

          {/* Controls */}
          <div className="px-5 py-4 space-y-4">
            {/* Zoom */}
            <div className="flex items-center gap-3">
              <ZoomOut size={14} className="text-muted-foreground flex-shrink-0" />
              <input
                type="range" min={1} max={3} step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-1.5 rounded-full accent-primary cursor-pointer"
              />
              <ZoomIn size={14} className="text-muted-foreground flex-shrink-0" />
            </div>

            {/* Rotation */}
            <div className="flex items-center gap-3">
              <RotateCw size={14} className="text-muted-foreground flex-shrink-0" />
              <input
                type="range" min={-180} max={180} step={1}
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="flex-1 h-1.5 rounded-full accent-primary cursor-pointer"
              />
              <span className="text-xs text-muted-foreground w-10 text-right">{rotation}°</span>
            </div>

            {/* Tip */}
            <p className="text-xs text-muted-foreground/50 text-center">
              Drag to position · Scroll or slider to zoom
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button onClick={handleCancel} className="flex-1 btn-secondary flex items-center justify-center gap-2 py-2 text-sm">
                <X size={14} /> Cancel
              </button>
              <button onClick={handleConfirm} disabled={uploading} className="flex-1 btn-primary flex items-center justify-center gap-2 py-2 text-sm disabled:opacity-50">
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                {uploading ? "Uploading..." : "Confirm & Upload"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Normal state ──────────────────────────────────────────────────────────
  return (
    <div className="flex items-center gap-4">
      {preview && (
        <div className={`relative flex-shrink-0 w-16 h-16 overflow-hidden border border-primary/30 ${shape === "round" ? "rounded-full" : "rounded-lg"}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5 text-primary text-xs hover:bg-primary/10 transition-colors"
        >
          <Upload size={13} /> {label}
        </button>
        {preview && (
          <p className="text-xs text-muted-foreground/40">Click to replace</p>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
    </div>
  );
}
