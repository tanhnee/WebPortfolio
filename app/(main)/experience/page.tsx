import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ExperienceSection } from "@/components/sections/ExperienceSection";

export const metadata: Metadata = {
  title: "Experience",
  description: "Tran Le Buu Tanh's leadership, research and extracurricular experience.",
};

export const dynamic = "force-dynamic";

export default async function ExperiencePage() {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ order: "asc" }, { startDate: "desc" }],
  });

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">Experience</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          My journey through research, leadership, and community contributions.
        </p>
      </div>
      <ExperienceSection experiences={JSON.parse(JSON.stringify(experiences))} />
    </div>
  );
}
