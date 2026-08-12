"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
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
    <motion.article
      layout="position"
      initial={{ opacity: 0.94, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 18 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 border-b border-line p-3 last:border-b-0 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-5 sm:p-5 lg:grid-cols-[7rem_minmax(0,1fr)_auto] lg:items-center lg:p-6"
    >
      <a
        href={productHref}
        aria-label={`View ${product.title}`}
        className="relative block aspect-square w-full overflow-hidden rounded-md bg-stage focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <Image
          src={product.image}
          alt={product.title}
          fill
          sizes="112px"
          className="object-contain p-3 transition duration-300 ease-premium hover:scale-105"
        />
      </a>

      <div className="min-w-0">
        <p className="text-[11px] font-semibold capitalize text-muted sm:text-xs">
          {product.category}
        </p>
        <h2 className="mt-1 line-clamp-2 text-sm font-bold leading-5 text-ink sm:text-base sm:leading-6">
          <a
            href={productHref}
            className="rounded-sm transition-colors hover:text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {product.title}
          </a>
        </h2>
        <p className="mt-1.5 text-xs text-muted sm:text-sm">
          {currencyFormatter.format(product.price)} each
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 sm:mt-4 sm:gap-3">
          <div
            className="grid h-11 grid-cols-[2.75rem_3rem_2.75rem] overflow-hidden rounded-md bg-stage"
            aria-label={`Quantity for ${product.title}`}
          >
            <motion.button
              type="button"
              onClick={onDecrement}
              whileTap={{ scale: 0.88 }}
              aria-label={`Decrease quantity of ${product.title}`}
              className="inline-flex h-11 w-11 items-center justify-center text-ink transition-colors hover:bg-line focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink"
            >
              <Minus aria-hidden="true" size={17} strokeWidth={2.2} />
            </motion.button>
            <span
              className="inline-flex h-11 items-center justify-center border-x border-line text-sm font-black text-ink"
              aria-live="polite"
            >
              {quantity}
            </span>
            <motion.button
              type="button"
              onClick={onIncrement}
              whileTap={{ scale: 0.88 }}
              aria-label={`Increase quantity of ${product.title}`}
              className="inline-flex h-11 w-11 items-center justify-center text-ink transition-colors hover:bg-line focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ink"
            >
              <Plus aria-hidden="true" size={17} strokeWidth={2.2} />
            </motion.button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${product.title} from cart`}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-md px-2 text-xs font-bold text-danger transition-colors hover:bg-danger-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger sm:text-sm"
          >
            <Trash2 aria-hidden="true" size={15} />
            Remove
          </button>
        </div>
      </div>

      <div className="col-start-2 flex items-end justify-between gap-3 border-t border-line pt-3 lg:col-start-auto lg:block lg:min-w-28 lg:border-0 lg:pt-0 lg:text-right">
        <p className="text-xs font-semibold text-muted">Line total</p>
        <p className="text-lg font-black text-ink">
          {currencyFormatter.format(lineTotal)}
        </p>
      </div>
    </motion.article>
  );
}
