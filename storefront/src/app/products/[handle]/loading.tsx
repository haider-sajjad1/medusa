export default function Loading() {
  return (
    <div className="animate-pulse" aria-busy="true" aria-label="Loading product">
      <div className="h-4 w-32 rounded bg-neutral-200" />
      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="aspect-square w-full rounded-lg bg-neutral-200" />
        <div className="space-y-4">
          <div className="h-8 w-2/3 rounded bg-neutral-200" />
          <div className="h-6 w-1/4 rounded bg-neutral-200" />
          <div className="h-20 w-full rounded bg-neutral-200" />
        </div>
      </div>
    </div>
  );
}
