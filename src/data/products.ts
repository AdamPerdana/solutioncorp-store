import type { Product } from "@/types";

export const products: Product[] = [
  {
    id: 1,
    slug: "sterno-gel-200g",
    name: "Sterno Gel 200 g",
    price: 12500,
    description: "Sterno gel untuk buffet, menyala stabil sekitar 2 jam.",
    image: null,
    specs: [
      { label: "Jenis", value: "Gel" },
      { label: "Berat bersih", value: "200 g" },
      { label: "Durasi nyala", value: "± 2 jam" },
      { label: "Isi per karton", value: "48 pcs" },
    ],
  },
  {
    id: 2,
    slug: "sterno-gel-1kg",
    name: "Sterno Gel 1 kg",
    price: 45000,
    description: "Kemasan isi ulang untuk kebutuhan katering harian.",
    image: null,
    specs: [
      { label: "Jenis", value: "Gel" },
      { label: "Berat bersih", value: "200 g" },
      { label: "Durasi nyala", value: "± 2 jam" },
      { label: "Isi per karton", value: "48 pcs" },
    ],
  },
  {
    id: 3,
    slug: "sterno-kaleng-3-jam",
    name: "Sterno Kaleng 3 Jam",
    price: 18000,
    description: "Sterno kaleng siap pakai, durasi nyala sekitar 3 jam.",
    image: null,
    specs: [
      { label: "Jenis", value: "Gel" },
      { label: "Berat bersih", value: "200 g" },
      { label: "Durasi nyala", value: "± 2 jam" },
      { label: "Isi per karton", value: "48 pcs" },
    ],
  },
  {
    id: 4,
    slug: "sterno-kaleng-6-jam",
    name: "Sterno Kaleng 6 Jam",
    price: 27000,
    description: "Untuk acara panjang seperti resepsi dan konferensi.",
    image: null,
    specs: [
      { label: "Jenis", value: "Gel" },
      { label: "Berat bersih", value: "200 g" },
      { label: "Durasi nyala", value: "± 2 jam" },
      { label: "Isi per karton", value: "48 pcs" },
    ],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}