"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import type { ProjectImage } from "@/types";

interface ImageGalleryProps {
  images: ProjectImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 rounded-2xl border border-white/10 bg-white/3 text-muted-foreground text-sm">
        No images available
      </div>
    );
  }

  const navigate = (dir: 1 | -1) => {
    if (lightbox === null) return;
    setLightbox((prev) => {
      if (prev === null) return null;
      return (prev + dir + images.length) % images.length;
    });
  };

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            whileHover={{ scale: 1.02 }}
            className="relative aspect-video rounded-xl overflow-hidden border border-white/10 cursor-pointer group bg-muted"
            onClick={() => setLightbox(i)}
          >
            <Image
              src={img.url}
              alt={img.caption || `Image ${i + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <ZoomIn
                size={24}
                className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/60 text-xs text-white/80 truncate">
                {img.caption}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 text-white/70 hover:text-white"
              onClick={() => setLightbox(null)}
            >
              <X size={28} />
            </button>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
            >
              <ChevronLeft size={36} />
            </button>

            <motion.div
              key={lightbox}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-5xl max-h-[85vh] w-full h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightbox].url}
                alt={images[lightbox].caption || ""}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </motion.div>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2"
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
            >
              <ChevronRight size={36} />
            </button>

            {images[lightbox].caption && (
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                {images[lightbox].caption}
              </p>
            )}

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightbox(i); }}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === lightbox ? "bg-primary" : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
