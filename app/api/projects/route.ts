import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import slugify from "slugify";

const projectSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional(),
  category: z.string().min(1),
  status: z.string().default("completed"),
  featured: z.boolean().default(false),
  coverUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  pdfUrl: z.string().optional(),
  description: z.string().min(1),
  abstract: z.string().optional(),
  problem: z.string().optional(),
  objectives: z.string().optional(),
  methodology: z.string().optional(),
  architecture: z.string().optional(),
  features: z.string().optional(),
  results: z.string().optional(),
  lessons: z.string().optional(),
  role: z.string().optional(),
  team: z.string().optional(),
  githubUrl: z.string().optional(),
  demoUrl: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  tags: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured") === "true";

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (featured) {
      where.featured = true;
    }

    const projects = await prisma.project.findMany({
      where,
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("[PROJECTS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = projectSchema.parse(body);

    const slug = slugify(data.title, { lower: true, strict: true });

    const project = await prisma.project.create({
      data: {
        ...data,
        slug,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("[PROJECTS_POST]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
