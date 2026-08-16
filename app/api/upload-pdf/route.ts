import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const maxDuration = 30;

export const dynamic = "force-dynamic";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

    const filename = `pdf-${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const { error } = await supabase.storage
      .from("portfolio")
      .upload(filename, buffer, { contentType: "application/pdf", upsert: false });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage.from("portfolio").getPublicUrl(filename);

    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("[UPLOAD-PDF]", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
