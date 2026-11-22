import type { Metadata } from "next";
import Typography from "@mui/material/Typography";
import AccountManager, { type AdminAccountRow } from "@/components/admin/AccountManager";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/order";

export const metadata: Metadata = {
  title: "Akun admin | Admin Solution Corp",
};

export default async function AdminAccountsPage() {
  const currentAdmin = await requireAdmin();

  const admins = await prisma.admin.findMany({
    select: { id: true, username: true, createdAt: true },
    orderBy: { id: "asc" },
  });

  const rows: AdminAccountRow[] = admins.map((admin) => ({
    id: admin.id,
    username: admin.username,
    createdAt: formatDateTime(admin.createdAt),
    isCurrent: admin.id === currentAdmin.id,
  }));

  return (
    <>
      <Typography variant="h4" component="h1">
        Akun admin
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
        Semua admin punya akses yang sama ke dashboard.
      </Typography>

      <AccountManager admins={rows} />
    </>
  );
}