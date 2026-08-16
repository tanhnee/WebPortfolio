"use client";

import { AnimatedSection } from "@/components/common/AnimatedSection";
import { GraduationCap, MapPin, Mail, Phone, Linkedin, Award, BookOpen, Users, Trophy } from "lucide-react";
import type { Profile } from "@/types";

interface Education {
  id: string;
  school: string;
  degree: string;
  major: string;
  gpa?: string | null;
  startDate: Date | string;
  endDate?: Date | string | null;
  current: boolean;
  description?: string | null;
}

interface AwardItem {
  id: string;
  title: string;
  issuer?: string | null;
  year?: string | null;
}

interface ExperienceItem {
  id: string;
  position: string;
  company: string;
  description?: string | null;
}

interface AboutSectionProps {
  profile: Profile | null;
  education: Education[];
  awards?: AwardItem[];
  experiences?: ExperienceItem[];
  researchCount?: number;
}

export function AboutSection({ profile, education, awards = [], experiences = [], researchCount = 0 }: AboutSectionProps) {
  const edu = education[0];

  const highlights: { icon: React.ElementType; text: string }[] = [];

  if (researchCount > 0) {
    highlights.push({ icon: BookOpen, text: `${researchCount} Scientific Paper${researchCount > 1 ? "s" : ""} at National/International Conferences` });
  }

  awards.slice(0, 2).forEach((a) => {
    highlights.push({ icon: Trophy, text: a.title + (a.issuer ? ` — ${a.issuer}` : "") + (a.year ? ` (${a.year})` : "") });
  });

  experiences.slice(0, 1).forEach((e) => {
    if (e.position) highlights.push({ icon: Users, text: `${e.position} — ${e.company}` });
  });

  if (edu?.gpa) {
    highlights.push({ icon: GraduationCap, text: `GPA: ${edu.gpa} — ${edu.school}` });
  }

  const linkedinDisplayUrl = profile?.linkedinUrl?.replace(/^https?:\/\//, "") || null;

  return (
    <section id="about" className="section-padding">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-widest uppercase mb-3 block">About Me</span>
          <h2 className="section-title">Data-driven problem solver<br />with a passion for innovation</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <AnimatedSection direction="left">
            <div className="glass-card p-8">
              <h3 className="text-xl font-semibold text-foreground mb-4 gradient-text-cyan">Who I Am</h3>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-sm">
                {profile?.bio ? (
                  profile.bio.split("\n").filter(Boolean).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))
                ) : (
                  <p>Welcome to my portfolio.</p>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { icon: Mail, text: profile?.email, href: profile?.email ? `mailto:${profile.email}` : null },
                  { icon: Phone, text: profile?.phone, href: profile?.phone ? `tel:${profile.phone.replace(/\s/g, "")}` : null },
                  { icon: MapPin, text: profile?.location, href: null },
                  { icon: Linkedin, text: linkedinDisplayUrl, href: profile?.linkedinUrl || null },
                ].filter((item) => item.text).map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon size={14} className="text-primary" />
                    </div>
                    {item.href ? (
                      <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {item.text}
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">{item.text}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <div className="space-y-6">
            {highlights.length > 0 && (
              <AnimatedSection direction="right">
                <div className="glass-card p-6">
                  <h3 className="text-base font-semibold text-foreground mb-4 gradient-text-cyan">Key Highlights</h3>
                  <div className="space-y-3">
                    {highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <h.icon size={13} className="text-accent" />
                        </div>
                        <span className="text-sm text-muted-foreground leading-relaxed">{h.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            )}

            {edu && (
              <AnimatedSection direction="right" delay={0.1}>
                <div className="glass-card p-6">
                  <h3 className="text-base font-semibold text-foreground mb-4 gradient-text-cyan flex items-center gap-2">
                    <GraduationCap size={16} /> Education
                  </h3>
                  <p className="text-foreground font-semibold text-sm">{edu.school}</p>
                  <p className="text-primary text-sm mt-0.5">{edu.degree} — {edu.major}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(edu.startDate).getFullYear()} – {edu.current ? "Present" : edu.endDate ? new Date(edu.endDate).getFullYear() : ""}
                    </span>
                    {edu.gpa && <span className="badge-green text-xs">GPA: {edu.gpa}</span>}
                  </div>
                  {edu.description && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{edu.description}</p>}
                </div>
              </AnimatedSection>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
