import Link from "next/link";
import type { Product } from "@/lib/medusa";
import { getProductPrice } from "@/lib/price";
import ProductImage from "./ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  const price = getProductPrice(product);

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group block overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:shadow-md"
    >
      <ProductImage
        src={product.thumbnail}
        alt={product.title}
        className="aspect-square w-full transition group-hover:scale-[1.02]"
      />
      <div className="p-4">
        <h2 className="font-medium text-neutral-900">{product.title}</h2>
        <p className="mt-1 text-sm text-neutral-600">
          {price ?? "Price unavailable"}
        </p>
      </div>
    </Link>
  );
}
