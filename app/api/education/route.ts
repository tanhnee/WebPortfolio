import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const education = await prisma.education.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json(education);
  } catch (error) {
    console.error("[EDUCATION_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const created = await prisma.education.create({ data });
    revalidatePath("/"); revalidatePath("/about");
    return NextResponse.json(created);
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
