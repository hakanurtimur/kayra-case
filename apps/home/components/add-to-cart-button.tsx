"use client";

import { addToCart } from "@kayra/cart-contract";
import { ShoppingBag } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { toast } from "sonner";

type AddToCartButtonProps = {
  productId: number;
  productTitle: string;
  variant?: "card" | "compact" | "detail" | "icon";
};

export function AddToCartButton({
  productId,
  productTitle,
  variant = "card",
}: AddToCartButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  const handleAddToCart = () => {
    addToCart(productId);
    toast.success("Product added", {
      description: `${productTitle} is now in your cart.`,
    });
  };

  return (
    <motion.button
      type="button"
      onClick={handleAddToCart}
      aria-label={`Add to Cart: ${productTitle}`}
      whileHover={shouldReduceMotion ? undefined : { y: -2 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-accent font-bold text-ink transition-colors duration-200 ease-premium hover:bg-accent-strong focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:bg-line disabled:text-muted ${
        variant === "detail"
          ? "min-w-0 flex-1 px-6 text-sm sm:inline-flex sm:w-fit sm:flex-none"
          : variant === "compact"
            ? "shrink-0 px-3 text-xs sm:px-4 sm:text-sm"
            : variant === "icon"
              ? "h-11 w-11 shrink-0 px-0"
              : "w-full px-3 text-xs sm:text-sm"
      }`}
    >
      <ShoppingBag aria-hidden="true" size={16} strokeWidth={2.2} />
      {variant === "icon"
        ? null
        : variant === "compact"
          ? "Add"
          : "Add to Cart"}
    </motion.button>
  );
}
