import type { Metadata } from "next";
import { prisma, safeQuery } from "@/lib/db";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: { absolute: "Tran Le Buu Tanh | Portfolio" },
  description:
    "Portfolio of Tran Le Buu Tanh — E-commerce & Information Systems student specializing in AI, Data Analytics, and Business Intelligence.",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profile, skills, experiences, research, education, featuredProjects, awards, projectCount] =
    await Promise.all([
      safeQuery(() => prisma.profile.findFirst(), null),
      safeQuery(() => prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] }), []),
      safeQuery(() => prisma.experience.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] }), []),
      safeQuery(() => prisma.research.findMany({ orderBy: { publishedAt: "desc" } }), []),
      safeQuery(() => prisma.education.findMany({ orderBy: { order: "asc" } }), []),
      safeQuery(() => prisma.project.findMany({
        where: { featured: true },
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { images: { take: 1, orderBy: { order: "asc" } } },
      }), []),
      safeQuery(() => prisma.award.findMany({ orderBy: { order: "asc" } }), []),
      safeQuery(() => prisma.project.count(), 0),
    ]);

  return (
    <>
      <HeroSection
        profile={profile}
        education={education}
        researchCount={research.length}
        projectCount={projectCount}
        awardCount={awards.length}
      />
      <AboutSection profile={profile} education={education} awards={JSON.parse(JSON.stringify(awards))} experiences={JSON.parse(JSON.stringify(experiences))} researchCount={research.length} />
      <ExperienceSection experiences={JSON.parse(JSON.stringify(experiences))} />
      <ProjectsSection featuredProjects={JSON.parse(JSON.stringify(featuredProjects))} research={JSON.parse(JSON.stringify(research))} />
      <SkillsSection skills={skills} />
      <ContactSection profile={profile} />
    </>
  );
}
