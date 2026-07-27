import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { uploadsDir } from "@/lib/server/db";

// Serves admin-uploaded images (public — players need to see them). Only files
// matching the generated name pattern are served, from the uploads directory
// only, so there is no path traversal.

export const runtime = "nodejs";

const NAME_RE = /^[a-z0-9-]+\.webp$/;

export async function GET(
  _request: Request,
  { params }: { params: { name: string } },
) {
  if (!NAME_RE.test(params.name)) {
    return new Response("not found", { status: 404 });
  }
  try {
    const buffer = await readFile(join(uploadsDir(), params.name));
    return new Response(new Uint8Array(buffer), {
      headers: {
        "content-type": "image/webp",
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("not found", { status: 404 });
  }
}
