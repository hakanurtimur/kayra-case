"use client";

import { getCartItemCount } from "@kayra/cart-contract";
import { ShoppingBag } from "lucide-react";
import { useCartItems } from "@/hooks/use-cart";

type CartLinkProps = {
  variant?: "desktop" | "mobile";
};

export function CartLink({ variant = "desktop" }: CartLinkProps) {
  const itemCount = getCartItemCount(useCartItems());
  const isMobile = variant === "mobile";

  return (
    <a
      href="/cart"
      aria-label={`Cart ${itemCount}`}
      className={
        isMobile
          ? "flex min-w-0 items-center justify-center gap-2 rounded-md px-3 text-xs font-semibold text-white/70 transition duration-200 ease-premium hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          : "inline-flex min-h-11 items-center gap-2 rounded-md bg-ink px-4 text-sm font-semibold text-white transition duration-200 ease-premium hover:-translate-y-0.5 hover:bg-ink/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:translate-y-0"
      }
    >
      <ShoppingBag aria-hidden="true" size={isMobile ? 18 : 17} strokeWidth={2} />
      <span>Cart</span>
      <span
        aria-hidden="true"
        className={`inline-flex min-h-6 min-w-6 items-center justify-center rounded px-1.5 text-xs font-bold ${
          isMobile ? "bg-white/10 text-white" : "bg-accent text-ink"
        }`}
      >
        {itemCount}
      </span>
    </a>
  );
}
