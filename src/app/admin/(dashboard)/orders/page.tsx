import type { Metadata } from "next";
import Typography from "@mui/material/Typography";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Produk | Admin Solution Corp",
};

export default async function AdminProductsPage() {
  await requireAdmin();

  return (
    <>
      <Typography variant="h4" component="h1">
        Order
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Halaman ini sedang dibuat.
      </Typography>
    </>
  );
}