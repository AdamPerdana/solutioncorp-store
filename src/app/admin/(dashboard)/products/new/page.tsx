import type { Metadata } from "next";
import Typography from "@mui/material/Typography";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { EMPTY_PRODUCT_FORM } from "@/lib/product-form";

export const metadata: Metadata = {
  title: "Tambah produk | Admin Solution Corp",
};

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Tambah produk
      </Typography>
      <ProductForm initialData={EMPTY_PRODUCT_FORM} />
    </>
  );
}