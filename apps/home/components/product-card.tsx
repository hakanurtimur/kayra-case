import Image from "next/image";
import Link from "next/link";
import type { Product } from "@kayra/types";
import { AddToCartButton } from "./add-to-cart-button";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price);

  return (
    <article className="group flex h-full flex-col rounded-lg border border-slate-200 bg-white p-4 transition hover:border-pine/40 hover:shadow-sm">
      <Link
        href={`/products/${product.id}`}
        className="block rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-pine"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-slate-50">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-contain p-5 transition duration-200 group-hover:scale-[1.02]"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-xs font-medium capitalize text-pine">
          {product.category}
        </p>
        <h2 className="mt-2 line-clamp-2 min-h-12 text-base font-semibold leading-6 text-ink">
          <Link
            href={`/products/${product.id}`}
            className="rounded-sm transition hover:text-pine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
          >
            {product.title}
          </Link>
        </h2>
        <div className="mt-auto flex flex-col gap-3 pt-4">
          <p className="text-lg font-semibold text-ink">{price}</p>
          <AddToCartButton
            productId={product.id}
            productTitle={product.title}
          />
        </div>
      </div>
    </article>
  );
}
