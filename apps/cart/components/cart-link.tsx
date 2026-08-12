"use client";

import { getCartItemCount } from "@kayra/cart-contract";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

type CartLinkProps = {
  variant?: "desktop" | "mobile";
};

export function CartLink({ variant = "desktop" }: CartLinkProps) {
  const { items } = useCart();
  const itemCount = getCartItemCount(items);
  const itemLabel = itemCount === 1 ? "item" : "items";
  const isMobile = variant === "mobile";

  return (
    <a
      href="/cart"
      aria-current="page"
      aria-label={`View cart, ${itemCount} ${itemLabel}`}
      className={
        isMobile
          ? "flex min-w-0 items-center justify-center gap-2 rounded-md bg-accent px-3 text-xs font-semibold text-ink transition duration-200 ease-premium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          : "inline-flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-white transition duration-200 ease-premium hover:-translate-y-0.5 hover:bg-ink/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:translate-y-0"
      }
    >
      <ShoppingBag aria-hidden="true" size={isMobile ? 18 : 17} strokeWidth={2} />
      <span>Cart</span>
      <span
        aria-hidden="true"
        className={`inline-flex min-h-6 min-w-6 items-center justify-center rounded px-1.5 text-xs font-bold ${
          isMobile ? "bg-ink text-accent" : "bg-accent text-ink"
        }`}
      >
        {itemCount}
      </span>
    </a>
  );
}
