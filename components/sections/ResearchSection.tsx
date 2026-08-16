"use client";

import { motion } from "framer-motion";
import { BookOpen, ExternalLink, Calendar, Users } from "lucide-react";
import { AnimatedSection } from "@/components/common/AnimatedSection";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface Research {
  id: string;
  title: string;
  journal?: string | null;
  conference?: string | null;
  authors: string[];
  abstract: string;
  doi?: string | null;
  pdfUrl?: string | null;
  publishedAt?: Date | string | null;
  status: string;
  tags: string[];
}

interface ResearchSectionProps {
  research: Research[];
}

export function ResearchSection({ research }: ResearchSectionProps) {
  return (
    <section id="research" className="section-padding bg-card/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-widest uppercase mb-3 block">Publications</span>
          <h2 className="section-title">Research</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Academic contributions at the intersection of AI, data, and business
          </p>
        </AnimatedSection>

        <div className="space-y-6 max-w-4xl mx-auto">
          {research.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="glass-card p-6 card-hover">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <BookOpen size={18} className="text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-base font-semibold text-foreground leading-snug">{item.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs border flex-shrink-0 ${
                        item.status === "published"
                          ? "text-accent border-accent/30 bg-accent/5"
                          : "text-yellow-400 border-yellow-400/30 bg-yellow-400/5"
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <p className="text-primary text-sm font-medium mb-1">
                      {item.conference || item.journal}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 mb-3 text-xs text-muted-foreground">
                      {item.authors.length > 0 && (
                        <span className="flex items-center gap-1">
                          <Users size={11} />
                          {item.authors.join(", ")}
                        </span>
                      )}
                      {item.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar size={11} />
                          {formatDate(item.publishedAt)}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">
                      {item.abstract}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="badge text-xs">{tag}</span>
                      ))}
                      {item.doi && (
                        <a
                          href={`https://doi.org/${item.doi}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          DOI <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatedSection className="text-center mt-10">
          <Link href="/research" className="btn-secondary inline-flex items-center gap-2">
            View All Publications
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
