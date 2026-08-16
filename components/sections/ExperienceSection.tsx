"use client";

import { AnimatedSection } from "@/components/common/AnimatedSection";
import { formatDate } from "@/lib/utils";
import { MapPin, Briefcase, FlaskConical, Users, Megaphone } from "lucide-react";

interface Experience {
  id: string;
  company: string;
  position: string;
  type: string;
  description: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  current: boolean;
  location?: string | null;
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

const TYPE_ICONS: Record<string, React.ElementType> = {
  research: FlaskConical,
  leadership: Users,
  volunteer: Megaphone,
  work: Briefcase,
};

const TYPE_COLORS: Record<string, string> = {
  research: "text-primary bg-primary/10 border-primary/20",
  leadership: "text-accent bg-accent/10 border-accent/20",
  volunteer: "text-secondary bg-secondary/10 border-secondary/20",
  work: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
};

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-widest uppercase mb-3 block">Journey</span>
          <h2 className="section-title">Experience & Leadership</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            Research, leadership, and community contributions shaping my professional path
          </p>
        </AnimatedSection>

        <div className="relative max-w-3xl mx-auto">
          <div className="timeline-line" />

          <div className="space-y-8 ml-12">
            {experiences.map((exp, i) => {
              const Icon = TYPE_ICONS[exp.type] || Briefcase;
              const colorClass = TYPE_COLORS[exp.type] || TYPE_COLORS.work;

              return (
                <AnimatedSection key={exp.id} delay={i * 0.12}>
                  <div className="relative">
                    <div className="absolute -left-14 top-2 timeline-dot" />
                    <div className="glass-card p-6 card-hover">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                            <Icon size={16} />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold text-foreground leading-tight">{exp.position}</h3>
                            <p className="text-primary text-sm font-medium mt-0.5">{exp.company}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDate(exp.startDate)} – {exp.current ? "Present" : formatDate(exp.endDate)}
                          </span>
                          {exp.current && <span className="badge-green text-xs">Current</span>}
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{exp.description}</p>

                      {exp.location && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin size={11} />
                          {exp.location}
                        </div>
                      )}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
