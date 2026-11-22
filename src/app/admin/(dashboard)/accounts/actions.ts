"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { validatePassword, validateUsername } from "@/lib/admin-form";

type ActionResult = { ok: true; message: string } | { ok: false; error: string };

export async function createAdmin(input: {
  username: string;
  password: string;
}): Promise<ActionResult> {
  await requireAdmin();

  const username = input.username.trim();
  const error = validateUsername(username) ?? validatePassword(input.password);
  if (error) return { ok: false, error };

  const existing = await prisma.admin.findUnique({ where: { username } });
  if (existing) return { ok: false, error: `Username "${username}" sudah dipakai` };

  const passwordHash = await bcrypt.hash(input.password, 12);
  await prisma.admin.create({ data: { username, passwordHash } });

  revalidatePath("/admin/accounts");
  return { ok: true, message: `Admin "${username}" berhasil ditambahkan` };
}

export async function deleteAdmin(id: number): Promise<ActionResult> {
  const currentAdmin = await requireAdmin();

  // Pengaman 1: tidak boleh menghapus akun sendiri
  if (id === currentAdmin.id) {
    return { ok: false, error: "Anda tidak bisa menghapus akun sendiri" };
  }

  // Pengaman 2: harus selalu ada minimal satu admin
  const adminCount = await prisma.admin.count();
  if (adminCount <= 1) {
    return { ok: false, error: "Admin terakhir tidak bisa dihapus" };
  }

  try {
    const deleted = await prisma.admin.delete({ where: { id } });
    revalidatePath("/admin/accounts");
    return { ok: true, message: `Admin "${deleted.username}" berhasil dihapus` };
  } catch {
    return { ok: false, error: "Admin tidak ditemukan" };
  }
}

export async function changePassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<ActionResult> {
  const currentAdmin = await requireAdmin();

  const error = validatePassword(input.newPassword);
  if (error) return { ok: false, error };

  const admin = await prisma.admin.findUnique({ where: { id: currentAdmin.id } });
  const valid = admin ? await bcrypt.compare(input.currentPassword, admin.passwordHash) : false;
  if (!admin || !valid) return { ok: false, error: "Password saat ini salah" };

  const passwordHash = await bcrypt.hash(input.newPassword, 12);
  await prisma.admin.update({ where: { id: admin.id }, data: { passwordHash } });

  return { ok: true, message: "Password berhasil diganti" };
}
