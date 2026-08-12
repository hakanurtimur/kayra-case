export function CartSkeleton() {
  return (
    <div
      aria-label="Loading cart"
      aria-live="polite"
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8"
    >
      <div>
        <div className="mb-4 h-5 w-36 animate-pulse rounded bg-line" />
        <div className="overflow-hidden rounded-lg bg-surface">
          {[0, 1].map((item) => (
            <div
              key={item}
              className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 border-b border-line p-3 last:border-b-0 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-5 sm:p-5 lg:grid-cols-[7rem_minmax(0,1fr)_auto] lg:p-6"
            >
              <div className="aspect-square animate-pulse rounded-md bg-stage" />
              <div className="space-y-3 py-1">
                <div className="h-3 w-20 animate-pulse rounded bg-line" />
                <div className="h-5 w-3/4 animate-pulse rounded bg-line" />
                <div className="h-4 w-24 animate-pulse rounded bg-stage" />
                <div className="h-11 w-36 animate-pulse rounded-md bg-line" />
              </div>
              <div className="col-start-2 h-10 animate-pulse rounded bg-stage lg:col-start-auto lg:w-24" />
            </div>
          ))}
        </div>
      </div>
      <div className="h-64 animate-pulse rounded-lg bg-ink/90 p-6">
        <div className="h-6 w-32 rounded bg-white/20" />
        <div className="mt-8 h-4 w-full rounded bg-white/15" />
        <div className="mt-5 h-8 w-4/5 rounded bg-accent/40" />
      </div>
    </div>
  );
}
