"use client";

import Image from "next/image";
import type { CartLine } from "@/lib/cart-lines";

type CartItemRowProps = {
  homeHref: string;
  line: CartLine;
  onDecrement: () => void;
  onIncrement: () => void;
  onRemove: () => void;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function CartItemRow({
  homeHref,
  line,
  onDecrement,
  onIncrement,
  onRemove,
}: CartItemRowProps) {
  const { product, quantity, lineTotal } = line;
  const productHref = `${homeHref.replace(/\/$/, "")}/products/${product.id}`;

  return (
    <article className="grid gap-5 border-b border-slate-200 p-5 last:border-b-0 sm:grid-cols-[7rem_minmax(0,1fr)] sm:p-6 lg:grid-cols-[7rem_minmax(0,1fr)_auto] lg:items-center">
      <a
        href={productHref}
        className="relative block aspect-square w-28 overflow-hidden rounded-md border border-slate-200 bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-pine sm:w-full"
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="112px"
          className="object-contain p-3"
        />
      </a>

      <div className="min-w-0">
        <p className="text-xs font-medium capitalize text-pine">
          {product.category}
        </p>
        <h2 className="mt-1 text-base font-semibold leading-6 text-ink">
          <a
            href={productHref}
            className="rounded-sm transition hover:text-pine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
          >
            {product.title}
          </a>
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {currencyFormatter.format(product.price)} each
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div
            className="grid h-10 grid-cols-[2.5rem_3rem_2.5rem] overflow-hidden rounded-md border border-slate-300 bg-white"
            aria-label={`Quantity for ${product.title}`}
          >
            <button
              type="button"
              onClick={onDecrement}
              aria-label={`Decrease quantity of ${product.title}`}
              className="inline-flex h-10 w-10 items-center justify-center text-lg font-medium text-ink transition hover:bg-slate-100 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine"
            >
              -
            </button>
            <span
              className="inline-flex h-10 items-center justify-center border-x border-slate-300 text-sm font-semibold text-ink"
              aria-live="polite"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={onIncrement}
              aria-label={`Increase quantity of ${product.title}`}
              className="inline-flex h-10 w-10 items-center justify-center text-lg font-medium text-ink transition hover:bg-slate-100 focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-pine"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${product.title} from cart`}
            className="min-h-10 rounded-md px-2 text-sm font-medium text-red-700 transition hover:bg-red-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
          >
            Remove
          </button>
        </div>
      </div>

      <div className="sm:col-start-2 lg:col-start-auto lg:min-w-28 lg:text-right">
        <p className="text-xs font-medium uppercase text-slate-500">
          Line total
        </p>
        <p className="mt-1 text-lg font-semibold text-ink">
          {currencyFormatter.format(lineTotal)}
        </p>
      </div>
    </article>
  );
}
