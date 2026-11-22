import { readFile } from "node:fs/promises";
import path from "node:path";
import { SAFE_FILENAME, UPLOAD_DIR } from "@/lib/uploads";

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

type RouteContext = {
  params: Promise<{ filename: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { filename } = await params;

  // Tolak nama file aneh (misalnya "../.env") supaya file lain tidak bisa diintip
  if (!SAFE_FILENAME.test(filename)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const file = await readFile(path.join(UPLOAD_DIR, filename));
    const extension = filename.split(".").pop() ?? "";
    return new Response(file, {
      headers: {
        "Content-Type": CONTENT_TYPES[extension],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}