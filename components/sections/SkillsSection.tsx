"use client";

import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/common/AnimatedSection";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  order: number;
}

interface SkillsSectionProps {
  skills: Skill[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Business: "#00ff88",
  Data: "#39ff14",
  Technology: "#00e5a0",
  AI: "#A78BFA",
  "Soft Skills": "#F59E0B",
};

export function SkillsSection({ skills }: SkillsSectionProps) {
  // Group skills by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  // Fallback if no skills from DB yet
  const categories = Object.keys(grouped).length > 0
    ? Object.keys(grouped)
    : ["Business", "Data", "Technology", "AI"];

  return (
    <section id="skills" className="section-padding bg-card/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <AnimatedSection className="text-center mb-16">
          <span className="text-primary text-sm font-medium tracking-widest uppercase mb-3 block">Expertise</span>
          <h2 className="section-title">Skills & Competencies</h2>
          <p className="section-subtitle max-w-xl mx-auto">
            A comprehensive skill set spanning business analysis, data science, AI, and technology
          </p>
        </AnimatedSection>

        {/* Language badges */}
        <AnimatedSection className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { label: "English", sub: "TOEIC 775/990", color: "primary" },
            { label: "Vietnamese", sub: "Native", color: "accent" },
          ].map((lang) => (
            <div key={lang.label} className="glass-card px-5 py-3 flex items-center gap-3">
              <span className={`text-${lang.color} font-semibold`}>{lang.label}</span>
              <span className="text-muted-foreground text-sm">{lang.sub}</span>
            </div>
          ))}
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {categories.map((category, ci) => {
            const categorySkills = grouped[category] || [];
            const color = CATEGORY_COLORS[category] || "#00E5FF";
            return (
              <AnimatedSection key={category} delay={ci * 0.1}>
                <div className="glass-card p-6 h-full">
                  <div className="flex items-center gap-3 mb-5">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                    />
                    <h3 className="text-base font-semibold text-foreground">{category}</h3>
                    <span className="text-xs text-muted-foreground ml-auto">{categorySkills.length} skills</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill, si) => (
                      <motion.span
                        key={skill.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: si * 0.05 }}
                        className="px-3 py-1.5 rounded-full text-xs font-medium border"
                        style={{
                          borderColor: `${color}40`,
                          color: color,
                          background: `${color}10`,
                        }}
                      >
                        {skill.name}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
