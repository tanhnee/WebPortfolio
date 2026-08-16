import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { EducationManager } from "./EducationManager";

export const metadata: Metadata = { title: "Manage Education" };
export const dynamic = "force-dynamic";

export default async function AdminEducationPage() {
  const education = await prisma.education.findMany({ orderBy: { order: "asc" } });
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-1">Education</h1>
        <p className="text-muted-foreground">{education.length} entries · shown in About section</p>
      </div>
      <EducationManager education={JSON.parse(JSON.stringify(education))} />
    </div>
  );
}
