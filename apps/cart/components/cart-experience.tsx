"use client";

import { useQuery } from "@tanstack/react-query";
import {
  clearCart,
  getCartItemCount,
  removeFromCart,
  updateCartItem,
} from "@kayra/cart-contract";
import {
  ArrowRight,
  CircleAlert,
  PackageOpen,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { StatePanel } from "@kayra/ui";
import { useCart } from "@/hooks/use-cart";
import { createCartLines } from "@/lib/cart-lines";
import { getProducts } from "@/lib/fake-store";
import { CartItemRow } from "./cart-item-row";
import { CartSkeleton } from "./cart-skeleton";

type CartExperienceProps = {
  homeHref: string;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const enterTransition = {
  duration: 0.42,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function CartExperience({ homeHref }: CartExperienceProps) {
  const { isHydrated, items } = useCart();
  const productsQuery = useQuery({
    enabled: isHydrated && items.length > 0,
    queryFn: () => getProducts(),
    queryKey: ["fake-store-products"],
  });

  if (!isHydrated || (items.length > 0 && productsQuery.isPending)) {
    return <CartSkeleton />;
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0.92, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={enterTransition}
      >
        <StatePanel
          action={
            <a
              href={homeHref}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-5 text-sm font-bold text-white transition duration-200 ease-premium hover:-translate-y-0.5 hover:bg-ink/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Continue shopping
              <ArrowRight aria-hidden="true" size={17} />
            </a>
          }
          description="Browse the collection and add something worth keeping. Your picks will appear here."
          icon={<PackageOpen aria-hidden="true" size={24} />}
          title="Your cart is empty"
        />
      </motion.div>
    );
  }

  if (productsQuery.isError) {
    return (
      <motion.div
        initial={{ opacity: 0.92, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={enterTransition}
      >
        <StatePanel
          action={
            <button
              type="button"
              onClick={() => productsQuery.refetch()}
              disabled={productsQuery.isFetching}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-5 text-sm font-bold text-white transition duration-200 ease-premium hover:-translate-y-0.5 hover:bg-ink/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-wait disabled:bg-muted"
            >
              <RotateCcw aria-hidden="true" size={17} />
              {productsQuery.isFetching ? "Retrying..." : "Retry"}
            </button>
          }
          description="Your saved quantities are still here. Retry once the product catalog is available."
          icon={<CircleAlert aria-hidden="true" size={24} />}
          title="We could not load your cart details"
          tone="danger"
        />
      </motion.div>
    );
  }

  const lines = createCartLines(items, productsQuery.data ?? []);
  const itemCount = getCartItemCount(items);
  const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);
  const missingItemCount = items.length - lines.length;

  const handleRemove = (productId: number, productTitle: string) => {
    removeFromCart(productId);
    toast.success("Item removed", {
      description: `${productTitle} was removed from your cart.`,
    });
  };

  const handleDecrement = (
    productId: number,
    quantity: number,
    productTitle: string,
  ) => {
    updateCartItem(productId, quantity - 1);

    if (quantity === 1) {
      toast.success("Item removed", {
        description: `${productTitle} was removed from your cart.`,
      });
    }
  };

  const handleClear = () => {
    clearCart();
    toast.success("Cart cleared", {
      description: "All items were removed from your cart.",
    });
  };

  if (lines.length === 0) {
    return (
      <StatePanel
        action={
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-ink px-5 text-sm font-bold text-white transition duration-200 ease-premium hover:bg-ink/85 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            <Trash2 aria-hidden="true" size={17} />
            Clear cart
          </button>
        }
        description="The catalog no longer contains the products saved in this cart."
        icon={<PackageOpen aria-hidden="true" size={24} />}
        title="Saved products are unavailable"
        tone="warning"
      />
    );
  }

  return (
    <motion.div
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start lg:gap-8"
      initial={{ opacity: 0.94, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={enterTransition}
    >
      <section aria-label="Cart items">
        <p className="mb-4 text-sm font-bold text-ink" aria-live="polite">
          {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
        </p>

        {missingItemCount > 0 ? (
          <p className="mb-4 rounded-md bg-warning-soft px-4 py-3 text-sm text-warning">
            Some saved products are no longer available and are excluded from
            the subtotal.
          </p>
        ) : null}

        <div className="overflow-hidden rounded-lg bg-surface">
          <AnimatePresence initial={false} mode="popLayout">
            {lines.map((line) => (
              <CartItemRow
                key={line.product.id}
                homeHref={homeHref}
                line={line}
                onDecrement={() =>
                  handleDecrement(
                    line.product.id,
                    line.quantity,
                    line.product.title,
                  )
                }
                onIncrement={() =>
                  updateCartItem(line.product.id, line.quantity + 1)
                }
                onRemove={() =>
                  handleRemove(line.product.id, line.product.title)
                }
              />
            ))}
          </AnimatePresence>
        </div>
      </section>

      <aside
        aria-labelledby="cart-summary-heading"
        className="rounded-lg bg-ink p-6 text-white lg:sticky lg:top-28"
      >
        <h2 id="cart-summary-heading" className="text-xl font-black">
          Summary
        </h2>
        <dl className="mt-6 space-y-4 text-sm">
          <div className="flex items-center justify-between gap-4 text-white/65">
            <dt>Total items</dt>
            <dd className="font-bold text-white">{itemCount}</dd>
          </div>
          <div className="flex items-end justify-between gap-4 border-t border-white/15 pt-5">
            <dt className="font-bold text-white">Subtotal</dt>
            <dd className="text-2xl font-black text-accent">
              {currencyFormatter.format(subtotal)}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-5 text-white/55">
          Taxes and shipping are outside this assignment.
        </p>
        <button
          type="button"
          onClick={handleClear}
          className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-white/20 px-4 text-sm font-bold text-white transition duration-200 ease-premium hover:border-danger hover:bg-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Trash2 aria-hidden="true" size={17} />
          Clear cart
        </button>
      </aside>
    </motion.div>
  );
}
