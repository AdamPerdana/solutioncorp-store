"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { requireAdmin } from "@/lib/auth/auth";
import { deleteImage, saveImage } from "@/lib/products/uploads";
import {
  parsePrice,
  validateProductForm,
  type ProductFormData,
  type ProductFormErrors,
} from "@/lib/products/product-form";

type SaveResult = { errors: ProductFormErrors };

// Rapikan data form jadi bentuk yang siap disimpan
function toProductData(data: ProductFormData) {
  return {
    name: data.name.trim(),
    slug: data.slug,
    price: parsePrice(data.price),
    description: data.description.trim(),
    image: data.image,
  };
}

function toSpecRows(data: ProductFormData) {
  return data.specs.map((spec, index) => ({
    label: spec.label.trim(),
    value: spec.value.trim(),
    sortOrder: index,
  }));
}

async function isSlugTaken(slug: string, exceptId?: number): Promise<boolean> {
  const existing = await prisma.product.findUnique({ where: { slug } });
  return !!existing && existing.id !== exceptId;
}

export async function uploadProductImage(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  await requireAdmin();

  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Pilih foto terlebih dahulu" };
  }

  try {
    return { url: await saveImage(file) };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Foto gagal di-upload" };
  }
}

export async function createProduct(data: ProductFormData): Promise<SaveResult> {
  await requireAdmin();

  const errors = validateProductForm(data);
  if (Object.keys(errors).length > 0) return { errors };

  if (await isSlugTaken(data.slug)) {
    return { errors: { slug: "Slug ini sudah dipakai produk lain" } };
  }

  await prisma.product.create({
    data: {
      ...toProductData(data),
      specs: { create: toSpecRows(data) },
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(id: number, data: ProductFormData): Promise<SaveResult> {
  await requireAdmin();

  const errors = validateProductForm(data);
  if (Object.keys(errors).length > 0) return { errors };

  if (await isSlugTaken(data.slug, id)) {
    return { errors: { slug: "Slug ini sudah dipakai produk lain" } };
  }

  const oldProduct = await prisma.product.findUnique({ where: { id } });

  await prisma.product.update({
    where: { id },
    data: {
      ...toProductData(data),
      // Spesifikasi lama dihapus semua, lalu diganti dengan yang baru
      specs: { deleteMany: {}, create: toSpecRows(data) },
    },
  });

  // Foto diganti atau dihapus? Buang file lamanya dari server
  if (oldProduct && oldProduct.image !== data.image) {
    await deleteImage(oldProduct.image);
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(id: number): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();

  try {
    const deleted = await prisma.product.delete({ where: { id } });
    await deleteImage(deleted.image);
  } catch {
    return { ok: false, message: "Produk gagal dihapus. Mungkin sudah dihapus sebelumnya." };
  }

  revalidatePath("/admin/products");
  return { ok: true, message: "Produk berhasil dihapus" };
}