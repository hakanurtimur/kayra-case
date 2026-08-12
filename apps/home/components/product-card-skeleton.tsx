export function ProductCardSkeleton() {
  return (
    <article className="h-full">
      <div className="aspect-[4/5] animate-pulse rounded-lg bg-stage" />
      <div className="space-y-3 px-1 pt-3 sm:pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="h-3 w-20 animate-pulse rounded bg-line" />
          <div className="h-3 w-10 animate-pulse rounded bg-line" />
        </div>
        <div className="h-4 w-full animate-pulse rounded bg-line" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-stage" />
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="h-5 w-16 animate-pulse rounded bg-line" />
          <div className="h-11 w-20 animate-pulse rounded-md bg-line" />
        </div>
      </div>
    </article>
  );
}
