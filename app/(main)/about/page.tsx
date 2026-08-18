import type { Metadata } from "next";
import { prisma, safeQuery } from "@/lib/db";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";

export const metadata: Metadata = {
  title: "About",
  description: "Learn more about Tran Le Buu Tanh — E-commerce student, Business Analyst, Data Analyst, and AI Solution Builder.",
};

export const revalidate = 60;

export default async function AboutPage() {
  const [profile, skills, education] = await Promise.all([
    safeQuery(() => prisma.profile.findFirst(), null),
    safeQuery(() => prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] }), []),
    safeQuery(() => prisma.education.findMany({ orderBy: { order: "asc" } }), []),
  ]);

  return (
    <div className="pt-20">
      <AboutSection profile={profile} education={JSON.parse(JSON.stringify(education))} />
      <SkillsSection skills={skills} />
    </div>
  );
}
