import { ProductCardSkeleton } from "@/components/product-card-skeleton";

export default function Loading() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 py-6 sm:px-8 lg:px-10">
      <main className="flex-1 py-10 sm:py-14">
        <section className="border-b border-slate-200 pb-8">
          <div className="h-4 w-24 rounded bg-slate-200" />
          <div className="mt-4 h-10 w-44 rounded bg-slate-200" />
          <div className="mt-4 h-5 max-w-2xl rounded bg-slate-100" />
        </section>
        <section
          aria-label="Loading product catalog"
          className="grid gap-5 py-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </section>
      </main>
    </div>
  );
}
