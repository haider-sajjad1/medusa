import ProductCard from "@/components/ProductCard";
import { getRegion, listProducts } from "@/lib/medusa";

export default async function HomePage() {
  const region = await getRegion();
  const products = await listProducts(region.id);

  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Products</h1>

      {products.length === 0 ? (
        <p className="text-neutral-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </>
  );
}
