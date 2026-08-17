"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Github, ArrowRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

const CATEGORY_COLORS: Record<string, string> = {
  AI: "text-primary border-primary/30 bg-primary/10",
  "Data Analytics": "text-accent border-accent/30 bg-accent/10",
  "Business Intelligence": "text-secondary border-secondary/30 bg-secondary/10",
  "Web Development": "text-purple-400 border-purple-400/30 bg-purple-400/10",
  Research: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
};

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export function ProjectCard({ project, className }: ProjectCardProps) {
  const categoryColor = CATEGORY_COLORS[project.category] || "text-primary border-primary/30 bg-primary/10";

  return (
    <Link href={`/projects/${project.slug}`} className="block h-full">
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "glass-card h-full flex flex-col overflow-hidden group cursor-pointer",
          "hover:border-primary/30 hover:shadow-cyan transition-all duration-300",
          className
        )}
      >
        {/* Cover Image */}
        <div className="relative bg-gradient-to-br from-muted to-card overflow-hidden" style={{ aspectRatio: "16/9" }}>
          {project.coverUrl ? (
            <Image
              src={project.coverUrl}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-5xl opacity-30">
                {project.category === "AI"
                  ? "🤖"
                  : project.category === "Data Analytics"
                  ? "📊"
                  : project.category === "Business Intelligence"
                  ? "📈"
                  : "💻"}
              </div>
            </div>
          )}

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent" />

          {/* Featured badge */}
          {project.featured && (
            <div className="absolute top-3 left-3">
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30">
                ⭐ Featured
              </span>
            </div>
          )}

          {/* Status */}
          <div className="absolute top-3 right-3">
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-medium border",
                project.status === "completed"
                  ? "text-accent border-accent/30 bg-accent/10"
                  : project.status === "in-progress"
                  ? "text-yellow-400 border-yellow-400/30 bg-yellow-400/10"
                  : "text-muted-foreground border-white/10 bg-white/5"
              )}
            >
              {project.status === "completed"
                ? "Completed"
                : project.status === "in-progress"
                ? "In Progress"
                : project.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          {/* Category */}
          <span
            className={cn(
              "inline-block px-2.5 py-1 rounded-lg text-xs font-medium border mb-3 w-fit",
              categoryColor
            )}
          >
            {project.category}
          </span>

          <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {project.title}
          </h3>

          {project.subtitle && (
            <p className="text-xs text-muted-foreground mb-2">{project.subtitle}</p>
          )}

          <p className="text-sm text-muted-foreground line-clamp-3 flex-1 leading-relaxed">
            {project.description}
          </p>

          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-4">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded text-xs bg-white/5 border border-white/10 text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="px-2 py-0.5 rounded text-xs bg-white/5 border border-white/10 text-muted-foreground">
                  +{project.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-all"
                >
                  <Github size={13} />
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                >
                  <ExternalLink size={13} />
                </a>
              )}
              {project.pdfUrl && (
                <a
                  href={project.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title="View Document"
                  className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/5 transition-all"
                >
                  <FileText size={13} />
                </a>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors">
              View Details
              <ArrowRight size={12} />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
