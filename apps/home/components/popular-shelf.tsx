import Image from "next/image";
import Link from "next/link";
import type { Product } from "@kayra/types";
import { ArrowRight, Star } from "lucide-react";
import { Container } from "@kayra/ui";
import { AddToCartButton } from "./add-to-cart-button";

type PopularShelfProps = {
  products: Product[];
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function PopularShelf({ products }: PopularShelfProps) {
  return (
    <section className="border-b border-line py-7 sm:py-9">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-muted sm:text-sm">
              Most reviewed
            </p>
            <h2 className="mt-1 text-2xl font-black text-ink sm:text-3xl">
              Popular right now
            </h2>
          </div>
          <a
            href="#catalog"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-md px-2 text-xs font-bold text-ink transition-colors hover:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:text-sm"
          >
            Shop all
            <ArrowRight aria-hidden="true" size={16} />
          </a>
        </div>

        <div className="-mx-4 mt-5 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="grid grid-flow-col auto-cols-[72%] gap-3 sm:auto-cols-[40%] sm:gap-4 lg:grid-flow-row lg:grid-cols-5">
            {products.map((product, index) => (
              <article key={product.id} className="flex min-w-0 flex-col">
                <Link
                  href={`/products/${product.id}`}
                  aria-label={`View ${product.title}`}
                  className="group block overflow-hidden rounded-lg bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-stage">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      priority={index < 2}
                      sizes="(min-width: 1024px) 18vw, (min-width: 640px) 38vw, 68vw"
                      className="object-contain p-4 transition-transform duration-500 ease-premium group-hover:scale-[1.05]"
                    />
                  </div>
                </Link>

                <div className="flex flex-1 flex-col px-1 pt-3">
                  <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-muted">
                    <span className="truncate capitalize">{product.category}</span>
                    <span className="inline-flex shrink-0 items-center gap-1">
                      <Star
                        aria-hidden="true"
                        size={12}
                        fill="currentColor"
                        className="text-accent-strong"
                      />
                      {product.rating.rate.toFixed(1)}
                    </span>
                  </div>
                  <h3 className="mt-1.5 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-ink">
                    <Link
                      href={`/products/${product.id}`}
                      className="rounded-sm transition-colors hover:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                    >
                      {product.title}
                    </Link>
                  </h3>
                  <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                    <p className="text-base font-black text-ink">
                      {currencyFormatter.format(product.price)}
                    </p>
                    <AddToCartButton
                      productId={product.id}
                      productTitle={product.title}
                      variant="icon"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
