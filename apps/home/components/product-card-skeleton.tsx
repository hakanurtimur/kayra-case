export function ProductCardSkeleton() {
  return (
    <article className="h-full rounded-lg border border-slate-200 bg-white p-4">
      <div className="aspect-[4/3] rounded-md bg-slate-100" />
      <div className="mt-4 space-y-3">
        <div className="h-3 w-24 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-3/4 rounded bg-slate-100" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-16 rounded bg-slate-200" />
          <div className="h-10 w-28 rounded-md bg-slate-200" />
        </div>
      </div>
    </article>
  );
}
