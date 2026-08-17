import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ResearchSection } from "@/components/sections/ResearchSection";

export const metadata: Metadata = {
  title: "Research",
  description: "Academic publications by Tran Le Buu Tanh in AI, data analytics, and business.",
};

export const revalidate = 60;

export default async function ResearchPage() {
  const research = await prisma.research.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div className="pt-20 pb-20 min-h-screen">
      <ResearchSection research={JSON.parse(JSON.stringify(research))} />
    </div>
  );
}
