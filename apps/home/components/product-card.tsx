import Image from "next/image";
import Link from "next/link";
import type { Product } from "@kayra/types";
import { Star } from "lucide-react";
import { AddToCartButton } from "./add-to-cart-button";
import { MotionSurface } from "./motion-surface";

type ProductCardProps = {
  index: number;
  product: Product;
};

export function ProductCard({ index, product }: ProductCardProps) {
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  return (
    <MotionSurface className="h-full" interactive>
      <article className="group flex h-full flex-col">
        <Link
          href={`/products/${product.id}`}
          aria-label={`View ${product.title}`}
          className="block overflow-hidden rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-stage transition-colors duration-300 ease-premium group-hover:bg-line/70">
            <Image
              src={product.image}
              alt={product.title}
              fill
              priority={index < 2}
              sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 23vw, (min-width: 640px) 31vw, 48vw"
              className="object-contain p-4 transition-transform duration-500 ease-premium group-hover:scale-[1.04] sm:p-6"
            />
          </div>
        </Link>

        <div className="flex flex-1 flex-col px-1 pt-3 sm:pt-4">
          <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-muted sm:text-xs">
            <p className="truncate capitalize">{product.category}</p>
            <p className="inline-flex shrink-0 items-center gap-1">
              <Star
                aria-hidden="true"
                size={13}
                fill="currentColor"
                className="text-accent-strong"
              />
              <span>{product.rating.rate.toFixed(1)}</span>
              <span className="hidden text-muted/70 sm:inline">
                ({product.rating.count})
              </span>
            </p>
          </div>
          <h2 className="mt-1.5 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-ink sm:min-h-12 sm:text-base sm:leading-6">
            <Link
              href={`/products/${product.id}`}
              className="rounded-sm transition-colors hover:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {product.title}
            </Link>
          </h2>
          <div className="mt-auto flex items-center justify-between gap-2 pt-3 sm:pt-4">
            <p className="text-base font-black text-ink sm:text-lg">{price}</p>
            <AddToCartButton
              productId={product.id}
              productTitle={product.title}
              variant="compact"
            />
          </div>
        </div>
      </article>
    </MotionSurface>
  );
}
