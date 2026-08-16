"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, ExternalLink } from "lucide-react";
import { ProjectCard } from "@/components/cards/ProjectCard";
import { AnimatedSection } from "@/components/common/AnimatedSection";
import type { Project } from "@/types";

interface Research {
  id: string;
  title: string;
  journal?: string | null;
  conference?: string | null;
  authors: string[];
  abstract: string;
  publishedAt?: string | null;
  status: string;
  tags: string[];
  doi?: string | null;
  pdfUrl?: string | null;
}

interface ProjectsSectionProps {
  featuredProjects: Project[];
  research?: Research[];
}

export function ProjectsSection({ featuredProjects, research = [] }: ProjectsSectionProps) {
  return (
    <section id="projects" className="section-padding bg-card/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-widest uppercase mb-3 block">Portfolio</span>
          <h2 className="section-title">Projects & Research</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Selected work in AI, Data Analytics, Business Intelligence, and academic research
          </p>
        </AnimatedSection>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-16">
            <AnimatedSection className="mb-8">
              <h3 className="text-xl font-semibold text-foreground/80">Featured Projects</h3>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {featuredProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <Link href="/projects" className="btn-primary inline-flex items-center gap-2">
                View All Projects <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}

        {/* Research Papers */}
        {research.length > 0 && (
          <div>
            <AnimatedSection className="mb-8">
              <h3 className="text-xl font-semibold text-foreground/80">Academic Research</h3>
            </AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {research.map((paper, i) => (
                <AnimatedSection key={paper.id} delay={i * 0.1}>
                  <div className="glass-card p-6 h-full flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <BookOpen size={16} className="text-accent" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground leading-snug">{paper.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {paper.journal || paper.conference}
                          {paper.publishedAt && ` · ${new Date(paper.publishedAt).getFullYear()}`}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-3">{paper.abstract}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {paper.tags.slice(0, 4).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-accent/10 text-accent border border-accent/20">
                          {tag}
                        </span>
                      ))}
                    </div>
                    {(paper.doi || paper.pdfUrl) && (
                      <a
                        href={paper.doi ? `https://doi.org/${paper.doi}` : paper.pdfUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1 w-fit"
                      >
                        View Paper <ExternalLink size={11} />
                      </a>
                    )}
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        )}

        {featuredProjects.length === 0 && research.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-5xl mb-4">🚀</div>
            <p>Projects coming soon. Add them via the admin panel.</p>
          </div>
        )}
      </div>
    </section>
  );
}
