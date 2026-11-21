import HeroBanner from "@/components/home/HeroBanner";
import ProductCatalog from "@/components/product/ProductCatalog";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getProducts();

  return (
    <>
      <HeroBanner />
      <ProductCatalog products={products} />
    </>
  );
}