import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { SkillsManager } from "./SkillsManager";

export const metadata: Metadata = { title: "Manage Skills" };

export default async function AdminSkillsPage() {
  const skills = await prisma.skill.findMany({ orderBy: [{ category: "asc" }, { order: "asc" }] });

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-1">Skills</h1>
        <p className="text-muted-foreground">Manage your skills and expertise</p>
      </div>
      <SkillsManager skills={JSON.parse(JSON.stringify(skills))} />
    </div>
  );
}
