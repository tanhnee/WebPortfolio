import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    let profile = await prisma.profile.findFirst();

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          name: "Le Buu Tanh",
          title: "Business Analyst | Data Analyst | AI Solution Builder",
          bio: "I'm an E-commerce student with a strong background in Information Systems, Business Analysis, and Data Analytics. I specialize in building intelligent systems that optimize processes, enhance decision-making, and create real value.",
          email: "buutanh10032005@gmail.com",
          location: "Ho Chi Minh City, Vietnam",
          linkedinUrl: "https://www.linkedin.com/in/buu-tanh-tran-le-1587a8321/",
        },
      });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("[PROFILE_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    let profile = await prisma.profile.findFirst();

    if (profile) {
      profile = await prisma.profile.update({
        where: { id: profile.id },
        data: body,
      });
    } else {
      profile = await prisma.profile.create({ data: body });
    }

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/contact");
    return NextResponse.json(profile);
  } catch (error) {
    console.error("[PROFILE_PUT]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
