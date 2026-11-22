import type { Metadata } from "next";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import StatCard from "@/components/admin/StatCard";
import VisitorChart from "@/components/admin/VisitorChart";
import { requireAdmin } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { lastNDays } from "@/lib/utils/dates";

export const metadata: Metadata = {
  title: "Ringkasan | Admin Solution Corp",
};

export default async function AdminHomePage() {
  const admin = await requireAdmin();

  const days14 = lastNDays(14);
  const days7 = days14.slice(-7);
  const today = days14[days14.length - 1];

  const [productCount, notFollowedUpCount, todayVisitors, weekVisitors, perDay] = await Promise.all([
    prisma.product.count(),
    prisma.order.count({ where: { status: "BARU" } }),
    prisma.dailyVisitor.count({ where: { day: today } }),
    // Orang yang sama di beberapa hari tetap dihitung 1
    prisma.dailyVisitor.groupBy({ by: ["visitorId"], where: { day: { in: days7 } } }),
    prisma.dailyVisitor.groupBy({ by: ["day"], where: { day: { in: days14 } }, _count: { _all: true } }),
  ]);

  const chartData = days14.map((day) => ({
    day,
    label: new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(
      new Date(`${day}T00:00:00`),
    ),
    count: perDay.find((row) => row.day === day)?._count._all ?? 0,
  }));

  return (
    <>
      <Typography variant="h4" component="h1">
        Halo, {admin.username} 👋
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 4 }}>
        Ringkasan toko Solution Corp Indonesia.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Pengunjung hari ini" value={todayVisitors} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Pengunjung 7 hari" value={weekVisitors.length} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Belum di-FU" value={notFollowedUpCount} href="/admin/leads" />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label="Jumlah produk" value={productCount} href="/admin/products" />
        </Grid>
      </Grid>

      <VisitorChart data={chartData} />
    </>
  );
}