import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

async function main() {
  const rl = createInterface({ input, output });
  const username = (await rl.question("Username admin: ")).trim();
  const password = await rl.question("Password (min. 8 karakter): ");
  rl.close();

  if (!/^[a-zA-Z0-9_]{3,50}$/.test(username)) {
    throw new Error("Username hanya boleh huruf, angka, dan _ (3-50 karakter)");
  }
  if (password.length < 8) {
    throw new Error("Password minimal 8 karakter");
  }

  const existing = await prisma.admin.findUnique({ where: { username } });
  if (existing) {
    throw new Error(`Username "${username}" sudah dipakai`);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.admin.create({ data: { username, passwordHash } });

  console.log(`✅ Admin "${username}" berhasil dibuat`);
}

main()
  .catch((error: Error) => {
    console.error(`❌ ${error.message}`);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());