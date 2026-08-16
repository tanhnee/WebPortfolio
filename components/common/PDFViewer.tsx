"use client";

import { useState } from "react";
import { FileText, ExternalLink, Download } from "lucide-react";

interface PDFViewerProps {
  url: string;
  title?: string;
}

export function PDFViewer({ url, title }: PDFViewerProps) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-white/10 bg-card">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-white/3">
        <FileText size={16} className="text-primary" />
        <span className="text-sm text-foreground/80 font-medium flex-1 truncate">
          {title || "Document"}
        </span>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-primary hover:text-accent transition-colors px-2.5 py-1 rounded-lg border border-primary/30 hover:border-accent/30 hover:bg-accent/5"
          >
            <ExternalLink size={12} />
            Open in new tab
          </a>
          <a
            href={url}
            download
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2.5 py-1 rounded-lg border border-white/10 hover:border-white/20"
          >
            <Download size={12} />
            Download
          </a>
        </div>
      </div>

      <div className="relative" style={{ height: "700px" }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card z-10">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Loading document...</p>
            </div>
          </div>
        )}
        <iframe
          src={`${url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
          className="w-full h-full border-0"
          title={title || "PDF Document"}
          onLoad={() => setLoading(false)}
          style={{ background: "#1a1a2e" }}
        />
      </div>
    </div>
  );
}
