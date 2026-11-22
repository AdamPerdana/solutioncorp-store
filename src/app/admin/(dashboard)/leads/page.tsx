import type { Metadata } from "next";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import LeadList, { type LeadRow } from "@/components/admin/LeadList";
import { requireAdmin } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { formatOrderCode } from "@/lib/orders/checkout";
import { formatDateTime, formatShortDate } from "@/lib/orders/order";

export const metadata: Metadata = {
  title: "Leads | Admin Solution Corp",
};

export default async function AdminLeadsPage() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    include: { items: true },
    // Yang belum di-FU di atas
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
  });

  const leads: LeadRow[] = orders.map((order) => ({
    id: order.id,
    code: formatOrderCode(order.id),
    shortDate: formatShortDate(order.createdAt),
    dateTime: formatDateTime(order.createdAt),
    name: order.name,
    company: order.company,
    phone: order.phone,
    region: order.region,
    address: order.address,
    subtotal: order.subtotal,
    followedUp: order.status === "SELESAI",
    items: order.items.map((item) => ({
      id: item.id,
      name: item.productName,
      price: item.price,
      qty: item.qty,
    })),
  }));

  const notFollowedUp = leads.filter((lead) => !lead.followedUp).length;

  return (
    <>
      <Typography variant="h4" component="h1">
        Leads
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
        {notFollowedUp > 0
          ? `${notFollowedUp} lead belum di-follow-up`
          : "Semua lead sudah di-follow-up"}
      </Typography>

      {leads.length === 0 ? (
        <Paper variant="outlined" sx={{ py: 8, textAlign: "center" }}>
          <Typography color="text.secondary">Belum ada lead yang masuk.</Typography>
        </Paper>
      ) : (
        <LeadList leads={leads} />
      )}
    </>
  );
}