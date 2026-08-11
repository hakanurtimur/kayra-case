export function CartSkeleton() {
  return (
    <div
      aria-label="Loading cart"
      aria-live="polite"
      className="grid animate-pulse gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]"
    >
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {[0, 1].map((item) => (
          <div
            key={item}
            className="flex gap-4 border-b border-slate-200 p-5 last:border-b-0"
          >
            <div className="h-24 w-24 shrink-0 rounded-md bg-slate-100" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 w-20 rounded bg-slate-100" />
              <div className="h-5 w-3/4 rounded bg-slate-100" />
              <div className="h-4 w-28 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-52 rounded-lg border border-slate-200 bg-white p-6">
        <div className="h-6 w-32 rounded bg-slate-100" />
        <div className="mt-8 h-4 w-full rounded bg-slate-100" />
        <div className="mt-4 h-4 w-4/5 rounded bg-slate-100" />
      </div>
    </div>
  );
}
