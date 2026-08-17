import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProjectDetailClient } from "./ProjectDetailClient";

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project) return { title: "Project Not Found" };
  return {
    title: project.title,
    description: project.description.slice(0, 160),
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { images: { orderBy: { order: "asc" } } },
  });
  if (!project) notFound();
  return <ProjectDetailClient project={JSON.parse(JSON.stringify(project))} />;
}
