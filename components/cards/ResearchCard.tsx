"use client";

import { BookOpen, ExternalLink, FileText } from "lucide-react";
import type { Research } from "@/types";

interface ResearchCardProps {
  research: Research;
}

export function ResearchCard({ research }: ResearchCardProps) {
  return (
    <div className="glass-card p-6 card-hover">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
          <BookOpen size={18} className="text-accent" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1 leading-snug">
            {research.title}
          </h3>

          {(research.journal || research.conference) && (
            <p className="text-sm text-primary mb-1">
              {research.journal || research.conference}
            </p>
          )}

          <p className="text-xs text-muted-foreground mb-3">
            {research.authors.join(", ")}
            {research.publishedAt && (
              <> &bull; {new Date(research.publishedAt).getFullYear()}</>
            )}
          </p>

          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-4">
            {research.abstract}
          </p>

          <div className="flex flex-wrap gap-2 mb-3">
            {research.tags.map((tag) => (
              <span key={tag} className="badge text-xs">
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <span className="badge-green text-xs">{research.status}</span>
            {research.doi && (
              <a
                href={`https://doi.org/${research.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <ExternalLink size={11} />
                DOI
              </a>
            )}
            {research.pdfUrl && (
              <a
                href={research.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                <FileText size={11} />
                PDF
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
