"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/auth";

export async function setFollowUp(id: number, done: boolean): Promise<{ ok: boolean }> {
  await requireAdmin();

  try {
    await prisma.order.update({
      where: { id },
      data: { status: done ? "SELESAI" : "BARU" },
    });
  } catch {
    return { ok: false };
  }

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true };
}