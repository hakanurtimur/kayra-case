import Image from "next/image";
import Link from "next/link";
import type { Product } from "@kayra/types";
import { ArrowDown, ArrowUpRight, Star } from "lucide-react";
import { Container } from "@kayra/ui";

type CatalogHeroProps = {
  product: Product;
};

export function CatalogHero({ product }: CatalogHeroProps) {
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  return (
    <section className="relative isolate overflow-hidden bg-accent text-white">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-[57%] bg-ink sm:w-[55%]"
      />
      <Container className="relative min-h-[20rem] sm:min-h-[22rem]">
        <div className="relative z-10 flex min-h-[20rem] max-w-[58%] flex-col justify-center py-8 sm:min-h-[22rem] sm:max-w-xl sm:py-10">
          <p className="text-xs font-bold text-accent sm:text-sm">
            The VEYRA edit
          </p>
          <h1 className="mt-2.5 text-[2rem] font-black leading-[1.02] text-white sm:text-4xl lg:text-5xl">
            Everyday pieces. Chosen well.
          </h1>
          <p className="mt-3 hidden max-w-lg text-sm leading-6 text-white/70 sm:block sm:text-base sm:leading-7">
            A concise collection for wearing, carrying, and living with less
            noise and better essentials.
          </p>

          <div className="mt-4 flex flex-col items-start gap-1 text-xs sm:mt-5 sm:flex-row sm:items-center sm:gap-3 sm:text-sm">
            <span className="max-w-full truncate font-bold text-white">
              {product.title}
            </span>
            <span className="font-black text-accent">{price}</span>
            <span className="hidden items-center gap-1 text-white/65 sm:inline-flex">
              <Star
                aria-hidden="true"
                size={14}
                fill="currentColor"
                className="text-accent"
              />
              {product.rating.rate.toFixed(1)}
            </span>
          </div>

          <div className="mt-5 flex flex-col items-start gap-3 sm:mt-6 sm:flex-row sm:items-center">
            <Link
              href={`/products/${product.id}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent px-4 text-xs font-black text-ink transition-colors duration-200 ease-premium hover:bg-accent-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-5 sm:text-sm"
            >
              View featured
              <ArrowUpRight aria-hidden="true" size={17} strokeWidth={2.4} />
            </Link>
            <a
              href="#catalog"
              className="hidden min-h-11 items-center gap-2 rounded-md px-2 text-sm font-bold text-white/75 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
            >
              Browse all
              <ArrowDown aria-hidden="true" size={16} />
            </a>
          </div>
        </div>

        <div className="absolute inset-y-0 right-0 w-[43%] sm:w-[45%]">
          <Link
            href={`/products/${product.id}`}
            aria-label={`View ${product.title}`}
            className="group relative block h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white"
          >
            <Image
              src={product.image}
              alt={product.title}
              fill
              priority
              sizes="(min-width: 1280px) 38vw, (min-width: 640px) 44vw, 43vw"
              className="object-contain p-4 transition-transform duration-700 ease-premium group-hover:scale-[1.035] sm:p-8 lg:p-10"
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}
