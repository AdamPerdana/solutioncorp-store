"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { createSession } from "@/lib/auth/session";

type LoginInput = {
  username: string;
  password: string;
};

export async function login(input: LoginInput): Promise<{ error: string }> {
  const username = input.username.trim();
  if (!username || !input.password) {
    return { error: "Username dan password wajib diisi" };
  }

  const admin = await prisma.admin.findUnique({ where: { username } });
  const passwordValid = admin
    ? await bcrypt.compare(input.password, admin.passwordHash)
    : false;

  // Pesan sengaja disamakan: jangan beri tahu mana yang salah
  if (!admin || !passwordValid) {
    return { error: "Username atau password salah" };
  }

  await createSession({ adminId: admin.id, username: admin.username });
  redirect("/admin");
}