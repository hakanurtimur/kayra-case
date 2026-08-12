import { Container } from "@kayra/ui";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";

export default function Loading() {
  return (
    <main aria-busy="true">
      <section className="relative overflow-hidden bg-accent">
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[57%] bg-ink sm:w-[55%]"
        />
        <Container className="relative flex min-h-[20rem] items-center sm:min-h-[22rem]">
          <div className="w-[52%] space-y-4">
            <div className="h-3 w-24 animate-pulse rounded bg-accent/70" />
            <div className="h-10 w-full max-w-sm animate-pulse rounded bg-white/15 sm:h-14" />
            <div className="h-10 w-36 animate-pulse rounded-md bg-accent/70" />
          </div>
          <div className="absolute right-0 h-[20rem] w-[43%] animate-pulse bg-accent-strong/35 sm:h-[22rem] sm:w-[45%]" />
        </Container>
      </section>

      <section className="border-b border-line bg-surface py-6 sm:py-8">
        <Container>
          <div className="h-4 w-24 animate-pulse rounded bg-line" />
          <div className="mt-2 h-8 w-44 animate-pulse rounded bg-line" />
          <div className="-mx-4 mt-5 overflow-hidden px-4 sm:mx-0 sm:px-0">
            <div className="grid grid-flow-col auto-cols-[66%] gap-3 sm:grid-flow-row sm:grid-cols-4 sm:gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 animate-pulse rounded-lg bg-stage sm:h-40"
                />
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line py-7 sm:py-9">
        <Container>
          <div className="h-4 w-20 animate-pulse rounded bg-line" />
          <div className="mt-2 h-8 w-52 animate-pulse rounded bg-line" />
          <div className="-mx-4 mt-5 overflow-hidden px-4 sm:mx-0 sm:px-0">
            <div className="grid grid-flow-col auto-cols-[72%] gap-3 sm:auto-cols-[40%] sm:gap-4 lg:grid-flow-row lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index}>
                  <div className="aspect-[4/3] animate-pulse rounded-lg bg-stage" />
                  <div className="mt-3 h-4 w-4/5 animate-pulse rounded bg-line" />
                  <div className="mt-3 h-8 w-full animate-pulse rounded bg-stage" />
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="border-b border-line bg-surface">
        <Container className="flex gap-2 py-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-11 w-20 animate-pulse rounded-md bg-stage"
            />
          ))}
        </Container>
      </section>
      <div className="h-[4.5rem] animate-pulse border-b border-line bg-canvas" />

      <Container className="pb-16 pt-8 sm:pb-20 sm:pt-10 lg:pt-12">
        <section>
          <div className="h-4 w-24 animate-pulse rounded bg-line" />
          <div className="mt-2 h-10 w-40 animate-pulse rounded bg-line" />
        </section>
        <section
          aria-label="Loading product catalog"
          className="grid grid-cols-2 gap-x-3 gap-y-8 pt-6 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 sm:pt-8 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-12"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </section>
      </Container>
    </main>
  );
}
