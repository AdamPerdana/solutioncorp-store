import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db/prisma";
import type { Product } from "@/types";

export async function getProducts(): Promise<Product[]> {
  return prisma.product.findMany({
    include: { specs: { orderBy: { sortOrder: "asc" } } },
    orderBy: { id: "asc" },
  });
}

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  return prisma.product.findUnique({
    where: { slug },
    include: { specs: { orderBy: { sortOrder: "asc" } } },
  });
});