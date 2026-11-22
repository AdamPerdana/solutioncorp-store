import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { getSession } from "@/lib/auth/session";

export type CurrentAdmin = {
  id: number;
  username: string;
};

// Ambil admin yang sedang login (atau null kalau belum login)
export const getCurrentAdmin = cache(async (): Promise<CurrentAdmin | null> => {
  const session = await getSession();
  if (!session) return null;

  // Pastiin akunnya masih aktif
  return prisma.admin.findUnique({
    where: { id: session.adminId },
    select: { id: true, username: true },
  });
});

// Wajib login: kalau belum, langsung dilempar ke halaman login
export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}