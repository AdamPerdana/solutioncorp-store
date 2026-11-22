"use server";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db/prisma";
import { toJakartaDateKey } from "@/lib/utils/dates";

const VISITOR_COOKIE = "visitor_id";
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export async function recordVisit() {
  const cookieStore = await cookies();
  let visitorId = cookieStore.get(VISITOR_COOKIE)?.value;

  // Pengunjung baru? Beri penanda acak (tanpa data pribadi)
  if (!visitorId || !/^[0-9a-f-]{36}$/.test(visitorId)) {
    visitorId = randomUUID();
    cookieStore.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + ONE_YEAR_MS),
    });
  }

  // Satu orang hanya dicatat sekali per hari
  await prisma.dailyVisitor.createMany({
    data: [{ visitorId, day: toJakartaDateKey(new Date()) }],
    skipDuplicates: true,
  });
}