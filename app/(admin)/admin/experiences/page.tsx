import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ExperiencesManager } from "./ExperiencesManager";

export const metadata: Metadata = { title: "Manage Experience" };
export const dynamic = "force-dynamic";

export default async function AdminExperiencesPage() {
  const experiences = await prisma.experience.findMany({ orderBy: [{ order: "asc" }, { startDate: "desc" }] });
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-1">Experience</h1>
        <p className="text-muted-foreground">{experiences.length} entries · shown in Experience section on homepage</p>
      </div>
      <ExperiencesManager experiences={JSON.parse(JSON.stringify(experiences))} />
    </div>
  );
}
