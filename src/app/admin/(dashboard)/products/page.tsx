import type { Metadata } from "next";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ProductTable, { type AdminProductRow } from "@/components/admin/ProductTable";
import AddProductButton from "@/components/admin/AddProductButton";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Produk | Admin Solution Corp",
};

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    orderBy: { id: "asc" },
    include: { _count: { select: { specs: true } } },
  });

  const rows: AdminProductRow[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    image: product.image,
    specCount: product._count.specs,
  }));

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { sm: "center" }, mb: 3 }}
      >
        <div>
          <Typography variant="h4" component="h1">
            Produk
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {rows.length} produk di toko
          </Typography>
        </div>
        <AddProductButton />
      </Stack>

      <ProductTable products={rows} />
    </>
  );
}