import HeroBanner from "@/components/HeroBanner";
import ProductCatalog from "@/components/ProductCatalog";
import { products } from "@/data/products";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <ProductCatalog products={products} />
    </>
  );
}