import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().optional(),
  body: z.string().min(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactSchema.parse(body);

    const message = await prisma.message.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject,
        body: data.body,
      },
    });

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: "buutanh10032005@gmail.com",
        replyTo: data.email,
        subject: `[Portfolio] ${data.subject || "New message"} — from ${data.name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
            <h2 style="color:#00E5FF">New message from your portfolio</h2>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Subject:</strong> ${data.subject || "(none)"}</p>
            <hr style="border:1px solid #eee;margin:16px 0"/>
            <p style="white-space:pre-wrap">${data.body}</p>
          </div>
        `,
      });
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error("[CONTACT_POST]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
