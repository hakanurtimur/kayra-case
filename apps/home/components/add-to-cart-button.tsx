"use client";

import { addToCart } from "@kayra/cart-contract";
import { toast } from "sonner";

type AddToCartButtonProps = {
  productId: number;
  productTitle: string;
};

export function AddToCartButton({
  productId,
  productTitle,
}: AddToCartButtonProps) {
  const handleAddToCart = () => {
    addToCart(productId);
    toast.success("Product added", {
      description: `${productTitle} is now in your cart.`,
    });
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      aria-label={`Add ${productTitle} to cart`}
      className="inline-flex min-h-10 w-full items-center justify-center rounded-md bg-pine px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine active:translate-y-px sm:w-fit"
    >
      Add to Cart
    </button>
  );
}
