"use client";

import { useQuery } from "@tanstack/react-query";
import {
  clearCart,
  getCartItemCount,
  removeFromCart,
  updateCartItem,
} from "@kayra/cart-contract";
import { toast } from "sonner";
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
      <section
        aria-labelledby="empty-cart-heading"
        className="rounded-lg border border-slate-200 bg-white px-6 py-14 text-center shadow-sm"
      >
        <h2
          id="empty-cart-heading"
          className="text-2xl font-semibold tracking-normal text-ink"
        >
          Your cart is empty
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-600">
          Browse the catalog and add something you would like to keep here.
        </p>
        <a
          href={homeHref}
          className="mt-6 inline-flex min-h-10 items-center rounded-md bg-pine px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
        >
          Continue Shopping
        </a>
      </section>
    );
  }

  if (productsQuery.isError) {
    return (
      <section
        aria-labelledby="cart-error-heading"
        className="rounded-lg border border-red-200 bg-white px-6 py-14 text-center shadow-sm"
      >
        <h2
          id="cart-error-heading"
          className="text-2xl font-semibold text-ink"
        >
          We could not load your cart details
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-600">
          Your saved quantities are still here. Retry the product catalog when
          the connection is available.
        </p>
        <button
          type="button"
          onClick={() => productsQuery.refetch()}
          disabled={productsQuery.isFetching}
          className="mt-6 inline-flex min-h-10 items-center rounded-md bg-pine px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine disabled:cursor-wait disabled:bg-slate-400"
        >
          {productsQuery.isFetching ? "Retrying..." : "Retry"}
        </button>
      </section>
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
      <section className="rounded-lg border border-amber-200 bg-white px-6 py-14 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-ink">
          Saved products are unavailable
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-600">
          The catalog no longer contains the products saved in this cart.
        </p>
        <button
          type="button"
          onClick={handleClear}
          className="mt-6 min-h-10 rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-pine hover:text-pine focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pine"
        >
          Clear Cart
        </button>
      </section>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-start">
      <section aria-label="Cart items">
        {missingItemCount > 0 ? (
          <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Some saved products are no longer available and are excluded from
            the subtotal.
          </p>
        ) : null}

        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
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
        </div>
      </section>

      <aside
        aria-labelledby="cart-summary-heading"
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6"
      >
        <h2 id="cart-summary-heading" className="text-xl font-semibold text-ink">
          Summary
        </h2>
        <dl className="mt-6 space-y-4 text-sm">
          <div className="flex items-center justify-between gap-4 text-slate-600">
            <dt>Total items</dt>
            <dd className="font-medium text-ink">{itemCount}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4">
            <dt className="font-medium text-ink">Subtotal</dt>
            <dd className="text-lg font-semibold text-ink">
              {currencyFormatter.format(subtotal)}
            </dd>
          </div>
        </dl>
        <p className="mt-4 text-xs leading-5 text-slate-500">
          Taxes and shipping are not included in this demo.
        </p>
        <button
          type="button"
          onClick={handleClear}
          className="mt-6 min-h-10 w-full rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-red-300 hover:bg-red-50 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
        >
          Clear Cart
        </button>
      </aside>
    </div>
  );
}
