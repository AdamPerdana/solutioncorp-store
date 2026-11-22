import type { Metadata } from "next";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import StatCard from "@/components/admin/StatCard";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Ringkasan | Admin Solution Corp",
};

export default async function AdminHomePage() {
  const admin = await requireAdmin();

  const [productCount, notFollowedUpCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count({ where: { status: "BARU" } }),
  ]);

  return (
    <>
      <Typography variant="h4" component="h1">
        Halo, {admin.username} 👋
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 4 }}>
        Ringkasan toko Solution Corp Indonesia.
      </Typography>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard label="Belum di-FU" value={notFollowedUpCount} href="/admin/leads" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard label="Jumlah produk" value={productCount} href="/admin/products" />
        </Grid>
      </Grid>
    </>
  );
}