import { prisma } from "@/lib/db";
import { VisualEditorClient } from "./VisualEditorClient";

export const dynamic = "force-dynamic";

export default async function VisualEditorPage() {
  const [profile, skills, experiences, research, education, projects, awards] = await Promise.all([
    prisma.profile.findFirst(),
    prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] }),
    prisma.experience.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] }),
    prisma.research.findMany({ orderBy: { publishedAt: "desc" } }),
    prisma.education.findMany({ orderBy: { order: "asc" } }),
    prisma.project.findMany({ orderBy: { createdAt: "desc" }, include: { images: { take: 1, orderBy: { order: "asc" } } } }),
    prisma.award.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <VisualEditorClient
      initialProfile={JSON.parse(JSON.stringify(profile))}
      initialSkills={JSON.parse(JSON.stringify(skills))}
      initialExperiences={JSON.parse(JSON.stringify(experiences))}
      initialResearch={JSON.parse(JSON.stringify(research))}
      initialEducation={JSON.parse(JSON.stringify(education))}
      initialProjects={JSON.parse(JSON.stringify(projects))}
      initialAwards={JSON.parse(JSON.stringify(awards))}
    />
  );
}
