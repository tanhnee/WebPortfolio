import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma, safeQuery } from "@/lib/db";
import { ProjectDetailClient } from "./ProjectDetailClient";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await safeQuery(() => prisma.project.findUnique({ where: { slug } }), null);
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: project.description.slice(0, 160),
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await safeQuery(() => prisma.project.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: "asc" } } },
  }), null);
  if (!project) notFound();
  return <ProjectDetailClient project={JSON.parse(JSON.stringify(project))} />;
}
