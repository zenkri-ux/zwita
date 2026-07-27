import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";
import { uploadsDir } from "@/lib/server/db";

// Protected by middleware. Accepts one image, downscales and converts it to
// WebP (so uploads stay small on the mill's weak network), and stores it in the
// uploads volume under a generated name. Returns the filename to reference.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB raw input
const MAX_WIDTH = 1600;

export async function POST(request: Request) {
  let file: File | null = null;
  try {
    const form = await request.formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
  } catch {
    return NextResponse.json({ error: "invalid_form" }, { status: 400 });
  }

  if (!file) return NextResponse.json({ error: "no_file" }, { status: 400 });
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "not_an_image" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 413 });
  }

  try {
    const input = Buffer.from(await file.arrayBuffer());
    const webp = await sharp(input)
      .rotate() // honour EXIF orientation
      .resize({ width: MAX_WIDTH, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer();
    const name = `${randomUUID()}.webp`;
    await writeFile(join(uploadsDir(), name), webp);
    return NextResponse.json({ ok: true, file: name });
  } catch (error) {
    console.error("upload processing failed", error);
    return NextResponse.json({ error: "processing_failed" }, { status: 500 });
  }
}
