import { ArrowLeft } from "lucide-react";
import { Container } from "@kayra/ui";

export default function ProductDetailLoading() {
  return (
    <main aria-busy="true">
      <Container className="py-6 sm:py-10 lg:py-12">
        <div className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted">
          <ArrowLeft aria-hidden="true" size={18} />
          Back to products
        </div>
        <div className="mt-5 grid gap-7 lg:mt-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:gap-12">
          <div className="aspect-[4/3] animate-pulse rounded-lg bg-stage sm:aspect-square" />
          <div className="space-y-5 lg:pt-2">
            <div className="h-7 w-28 animate-pulse rounded-md bg-line" />
            <div className="h-10 w-full animate-pulse rounded bg-line" />
            <div className="h-10 w-4/5 animate-pulse rounded bg-line" />
            <div className="h-9 w-28 animate-pulse rounded bg-line" />
            <div className="space-y-3 border-t border-line pt-6">
              <div className="h-4 w-full animate-pulse rounded bg-line" />
              <div className="h-4 w-full animate-pulse rounded bg-line" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-line" />
              <div className="mt-6 h-11 w-full animate-pulse rounded-md bg-line sm:w-40" />
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
