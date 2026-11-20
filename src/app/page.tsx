import HeroBanner from "@/components/home/HeroBanner";
import ProductCatalog from "@/components/product/ProductCatalog";
import { products } from "@/data/products";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <ProductCatalog products={products} />
    </>
  );
}