import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const research = await prisma.research.findMany({ orderBy: { publishedAt: "desc" } });
    return NextResponse.json(research);
  } catch (error) {
    console.error("[RESEARCH_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const created = await prisma.research.create({ data });
    revalidatePath("/"); revalidatePath("/research");
    return NextResponse.json(created);
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
