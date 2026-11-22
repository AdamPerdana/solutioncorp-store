import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

// Folder foto
export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
export const UPLOAD_URL_PREFIX = "/uploads/";

export const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2 MB

export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Pengaman Nama File
export const SAFE_FILENAME = /^[a-z0-9-]+\.(jpg|png|webp)$/;

export async function saveImage(file: File): Promise<string> {
  const extension = IMAGE_TYPES[file.type];
  if (!extension) throw new Error("Format foto harus JPG, PNG, atau WEBP");
  if (file.size > MAX_IMAGE_SIZE) throw new Error("Ukuran foto maksimal 2 MB");

  const filename = `${randomUUID()}.${extension}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, filename), Buffer.from(await file.arrayBuffer()));

  return `${UPLOAD_URL_PREFIX}${filename}`;
}

export async function deleteImage(url: string | null) {
  if (!url?.startsWith(UPLOAD_URL_PREFIX)) return;
  const filename = url.slice(UPLOAD_URL_PREFIX.length);
  if (!SAFE_FILENAME.test(filename)) return;

  try {
    await unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    // File tidak ada = ignore
  }
}