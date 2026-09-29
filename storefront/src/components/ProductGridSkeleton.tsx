export default function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div
      className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-lg border border-neutral-200 bg-white"
        >
          <div className="aspect-square w-full bg-neutral-200" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-3/4 rounded bg-neutral-200" />
            <div className="h-3 w-1/3 rounded bg-neutral-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
