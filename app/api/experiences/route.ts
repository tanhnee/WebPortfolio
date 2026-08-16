import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    });
    return NextResponse.json(experiences);
  } catch (error) {
    console.error("[EXPERIENCES_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const created = await prisma.experience.create({ data });
    revalidatePath("/"); revalidatePath("/experience");
    return NextResponse.json(created);
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
