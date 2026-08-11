"use client";

import { getCartItemCount } from "@kayra/cart-contract";
import { useCartItems } from "@/hooks/use-cart";

export function CartLink() {
  const itemCount = getCartItemCount(useCartItems());
  const itemLabel = itemCount === 1 ? "item" : "items";

  return (
    <a
      href="/cart"
      aria-label={`View cart, ${itemCount} ${itemLabel}`}
      className="inline-flex min-h-10 w-fit items-center gap-2 rounded-md bg-pine px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
    >
      <span>View Cart</span>
      <span
        aria-hidden="true"
        className="inline-flex min-h-6 min-w-6 items-center justify-center rounded bg-white px-1.5 text-xs font-semibold text-ink"
      >
        {itemCount}
      </span>
    </a>
  );
}
