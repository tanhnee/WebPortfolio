import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ResearchManager } from "./ResearchManager";

export const metadata: Metadata = { title: "Manage Research" };
export const dynamic = "force-dynamic";

export default async function AdminResearchPage() {
  const research = await prisma.research.findMany({ orderBy: { publishedAt: "desc" } });
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-1">Research</h1>
        <p className="text-muted-foreground">{research.length} papers · shown in Projects & Research section</p>
      </div>
      <ResearchManager research={JSON.parse(JSON.stringify(research))} />
    </div>
  );
}
