"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  Tag,
  Users,
  User,
  FileText,
  Image as ImageIcon,
  LayoutTemplate,
  BookOpen,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { ImageGallery } from "@/components/common/ImageGallery";
import { PDFViewer } from "@/components/common/PDFViewer";
import type { Project } from "@/types";

const TABS = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "architecture", label: "Architecture", icon: LayoutTemplate },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "document", label: "Document", icon: FileText },
];

function RichContent({ html }: { html: string }) {
  return (
    <div
      className="prose prose-invert prose-sm max-w-none text-muted-foreground leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function ProjectDetailClient({ project }: { project: Project }) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="pt-20 min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-72 md:h-96 overflow-hidden bg-gradient-to-br from-muted to-card">
        {project.coverUrl && (
          <Image
            src={project.coverUrl}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4 sm:left-8">
          <Link
            href="/projects"
            className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors glass px-3 py-1.5 rounded-xl"
          >
            <ArrowLeft size={14} />
            Back to Projects
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Title block */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <span className="badge mb-3">{project.category}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {project.title}
              </h1>
              {project.subtitle && (
                <p className="text-lg text-muted-foreground">
                  {project.subtitle}
                </p>
              )}
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-1 mb-6 border-b border-white/10 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all whitespace-nowrap border-b-2 -mb-px",
                    activeTab === tab.id
                      ? "text-primary border-primary"
                      : "text-muted-foreground border-transparent hover:text-foreground"
                  )}
                >
                  <tab.icon size={14} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="glass-card p-6">
                    <h2 className="text-lg font-semibold text-foreground mb-3">
                      Description
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {project.abstract && (
                    <div className="glass-card p-6">
                      <h2 className="text-lg font-semibold text-foreground mb-3">
                        Abstract
                      </h2>
                      <div
                        className="rich-content text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: project.abstract }}
                      />
                    </div>
                  )}

                  {project.problem && (
                    <div className="glass-card p-6">
                      <h2 className="text-lg font-semibold text-foreground mb-3">
                        Problem Statement
                      </h2>
                      <div
                        className="rich-content text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: project.problem }}
                      />
                    </div>
                  )}

                  {project.objectives && (
                    <div className="glass-card p-6">
                      <h2 className="text-lg font-semibold text-foreground mb-3">
                        Objectives
                      </h2>
                      <div
                        className="rich-content text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: project.objectives }}
                      />
                    </div>
                  )}

                  {project.results && (
                    <div className="glass-card p-6 border-accent/20">
                      <h2 className="text-lg font-semibold text-accent mb-3">
                        Results & Outcomes
                      </h2>
                      <div
                        className="rich-content text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: project.results }}
                      />
                    </div>
                  )}

                  {project.lessons && (
                    <div className="glass-card p-6">
                      <h2 className="text-lg font-semibold text-foreground mb-3">
                        Lessons Learned
                      </h2>
                      <div
                        className="rich-content text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: project.lessons }}
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === "architecture" && (
                <div className="space-y-6">
                  {project.methodology && (
                    <div className="glass-card p-6">
                      <h2 className="text-lg font-semibold text-foreground mb-3">
                        Methodology
                      </h2>
                      <div
                        className="rich-content text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: project.methodology }}
                      />
                    </div>
                  )}

                  {project.architecture && (
                    <div className="glass-card p-6">
                      <h2 className="text-lg font-semibold text-foreground mb-3">
                        System Architecture
                      </h2>
                      <div
                        className="rich-content text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: project.architecture }}
                      />
                    </div>
                  )}

                  {project.features && (
                    <div className="glass-card p-6">
                      <h2 className="text-lg font-semibold text-foreground mb-3">
                        Key Features
                      </h2>
                      <div
                        className="rich-content text-muted-foreground leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: project.features }}
                      />
                    </div>
                  )}

                  {!project.methodology &&
                    !project.architecture &&
                    !project.features && (
                      <div className="text-center py-16 text-muted-foreground">
                        <LayoutTemplate size={40} className="mx-auto mb-4 opacity-30" />
                        <p>Architecture details not available for this project.</p>
                      </div>
                    )}
                </div>
              )}

              {activeTab === "gallery" && (
                <div>
                  {project.images.length > 0 ? (
                    <ImageGallery images={project.images} />
                  ) : (
                    <div className="text-center py-16 text-muted-foreground">
                      <ImageIcon size={40} className="mx-auto mb-4 opacity-30" />
                      <p>No images available for this project.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "document" && (
                <div>
                  {project.pdfUrl ? (
                    <PDFViewer url={project.pdfUrl} title={project.title} />
                  ) : (
                    <div className="text-center py-16 text-muted-foreground">
                      <FileText size={40} className="mx-auto mb-4 opacity-30" />
                      <p>No document available for this project.</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-5"
            >
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Project Info
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Tag size={12} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="text-sm text-foreground">{project.category}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                    <Calendar size={12} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Timeline</p>
                    <p className="text-sm text-foreground">
                      {project.startDate
                        ? `${formatDate(project.startDate)} – ${
                            project.endDate
                              ? formatDate(project.endDate)
                              : "Present"
                          }`
                        : "Not specified"}
                    </p>
                  </div>
                </div>

                {project.role && (
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                      <User size={12} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="text-sm text-foreground">{project.role}</p>
                    </div>
                  </div>
                )}

                {project.team && (
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                      <Users size={12} className="text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Team</p>
                      <p className="text-sm text-foreground">{project.team}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Links */}
              {(project.githubUrl || project.demoUrl) && (
                <div className="mt-4 pt-4 border-t border-white/5 flex flex-col gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary flex items-center justify-center gap-2 text-sm py-2"
                    >
                      <Github size={14} />
                      View on GitHub
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center justify-center gap-2 text-sm py-2"
                    >
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                  )}
                </div>
              )}
            </motion.div>

            {/* Technologies */}
            {project.technologies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-5"
              >
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Technologies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-foreground/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tags */}
            {project.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-5"
              >
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="badge text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
