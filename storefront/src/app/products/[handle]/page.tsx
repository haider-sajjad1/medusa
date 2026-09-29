import Link from "next/link";
import { notFound } from "next/navigation";
import ProductImage from "@/components/ProductImage";
import { getProductByHandle, getRegion } from "@/lib/medusa";
import { getProductPrice } from "@/lib/price";

export default async function ProductPage({
  params,
}: PageProps<"/products/[handle]">) {
  const { handle } = await params;
  const region = await getRegion();
  const product = await getProductByHandle(handle, region.id);

  if (!product) notFound();

  const price = getProductPrice(product);
  const images = product.images?.length
    ? product.images
    : product.thumbnail
      ? [{ id: "thumbnail", url: product.thumbnail }]
      : [];

  return (
    <>
      <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
        ← Back to products
      </Link>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div>
          <ProductImage
            src={images[0]?.url}
            alt={product.title}
            className="aspect-square w-full rounded-lg"
          />
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-4">
              {images.slice(1).map((image) => (
                <ProductImage
                  key={image.id}
                  src={image.url}
                  alt={product.title}
                  className="aspect-square w-full rounded-md"
                />
              ))}
            </div>
          )}
        </div>

        <div className="md:sticky md:top-8 md:self-start">
          <h1 className="text-3xl font-semibold">{product.title}</h1>
          <p className="mt-2 text-xl text-neutral-800">
            {price ?? "Price unavailable"}
          </p>

          {product.description && (
            <p className="mt-6 leading-relaxed text-neutral-600">
              {product.description}
            </p>
          )}

          {product.options?.map((option) => (
            <div key={option.id} className="mt-6">
              <h2 className="text-sm font-medium text-neutral-900">
                {option.title}
              </h2>
              <ul className="mt-2 flex flex-wrap gap-2">
                {option.values.map((value) => (
                  <li
                    key={value.id}
                    className="rounded-md border border-neutral-300 px-3 py-1 text-sm"
                  >
                    {value.value}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
