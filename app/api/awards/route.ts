import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const awards = await prisma.award.findMany({
      orderBy: [{ order: "asc" }, { date: "desc" }],
    });
    return NextResponse.json(awards);
  } catch (error) {
    console.error("[AWARDS_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const created = await prisma.award.create({ data });
    revalidatePath("/"); revalidatePath("/about");
    return NextResponse.json(created);
  } catch {
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}
