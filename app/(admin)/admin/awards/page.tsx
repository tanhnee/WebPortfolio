import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { AwardsManager } from "./AwardsManager";

export const metadata: Metadata = { title: "Manage Awards" };
export const dynamic = "force-dynamic";

export default async function AdminAwardsPage() {
  const awards = await prisma.award.findMany({ orderBy: [{ order: "asc" }, { date: "desc" }] });
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-1">Awards</h1>
        <p className="text-muted-foreground">{awards.length} awards & recognition · shown in About section</p>
      </div>
      <AwardsManager awards={JSON.parse(JSON.stringify(awards))} />
    </div>
  );
}
