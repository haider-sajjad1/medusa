import ProductGridSkeleton from "@/components/ProductGridSkeleton";

export default function Loading() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-semibold">Products</h1>
      <ProductGridSkeleton />
    </>
  );
}
