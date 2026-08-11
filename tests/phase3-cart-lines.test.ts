import assert from "node:assert/strict";
import { test } from "node:test";
import { createCartLines } from "../apps/cart/lib/cart-lines";
import type { Product } from "../packages/types/src/index";

const products: Product[] = [
  {
    id: 1,
    title: "Backpack",
    price: 10.5,
    description: "A backpack.",
    category: "bags",
    image: "https://example.com/backpack.jpg",
    rating: { rate: 4, count: 10 },
  },
  {
    id: 2,
    title: "Jacket",
    price: 20,
    description: "A jacket.",
    category: "clothing",
    image: "https://example.com/jacket.jpg",
    rating: { rate: 4.5, count: 8 },
  },
];

test("createCartLines preserves cart order and calculates line totals", () => {
  const lines = createCartLines(
    [
      { productId: 2, quantity: 3 },
      { productId: 1, quantity: 2 },
    ],
    products,
  );

  assert.deepEqual(
    lines.map(({ product, quantity, lineTotal }) => ({
      productId: product.id,
      quantity,
      lineTotal,
    })),
    [
      { productId: 2, quantity: 3, lineTotal: 60 },
      { productId: 1, quantity: 2, lineTotal: 21 },
    ],
  );
});

test("createCartLines omits cart IDs that are missing from the catalog", () => {
  const lines = createCartLines(
    [
      { productId: 999, quantity: 1 },
      { productId: 1, quantity: 2 },
    ],
    products,
  );

  assert.deepEqual(lines.map((line) => line.product.id), [1]);
});
