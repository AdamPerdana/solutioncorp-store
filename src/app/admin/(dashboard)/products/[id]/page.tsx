import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Typography from "@mui/material/Typography";
import ProductForm from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";

export const metadata: Metadata = {
  title: "Edit produk | Admin Solution Corp",
};

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  await requireAdmin();

  const { id } = await params;
  const productId = Number(id);
  if (!Number.isInteger(productId)) notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { specs: { orderBy: { sortOrder: "asc" } } },
  });
  if (!product) notFound();

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Edit produk
      </Typography>
      <ProductForm
        productId={product.id}
        initialData={{
          name: product.name,
          slug: product.slug,
          price: String(product.price),
          description: product.description,
          image: product.image,
          specs: product.specs.map((spec) => ({ label: spec.label, value: spec.value })),
        }}
      />
    </>
  );
}