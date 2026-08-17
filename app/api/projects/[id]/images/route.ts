import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { url, caption } = await request.json();

    const count = await prisma.projectImage.count({ where: { projectId: id } });
    const image = await prisma.projectImage.create({
      data: { projectId: id, url, caption: caption || null, order: count },
    });

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("[PROJECT_IMAGE_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { imageId } = await request.json();

    await prisma.projectImage.delete({ where: { id: imageId, projectId: id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PROJECT_IMAGE_DELETE]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
