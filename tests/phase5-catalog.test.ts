import assert from "node:assert/strict";
import { test } from "node:test";
import {
  filterCatalogProducts,
  getFeaturedProduct,
  getPopularProducts,
  parseCatalogCategory,
} from "../apps/home/lib/catalog";
import type { Product } from "../packages/types/src/index";

const products: Product[] = [
  {
    id: 1,
    title: "Everyday Backpack",
    price: 109.95,
    description: "A practical backpack.",
    category: "men's clothing",
    image: "https://example.com/backpack.jpg",
    rating: { rate: 4.2, count: 120 },
  },
  {
    id: 3,
    title: "Cotton Jacket",
    price: 55.99,
    description: "A versatile jacket.",
    category: "men's clothing",
    image: "https://example.com/jacket.jpg",
    rating: { rate: 4.7, count: 80 },
  },
  {
    id: 6,
    title: "Gold Ring",
    price: 168,
    description: "A fine ring.",
    category: "jewelery",
    image: "https://example.com/ring.jpg",
    rating: { rate: 3.9, count: 44 },
  },
];

test("parseCatalogCategory accepts known slugs and falls back to all", () => {
  assert.equal(parseCatalogCategory("men"), "men");
  assert.equal(parseCatalogCategory("jewelry"), "jewelry");
  assert.equal(parseCatalogCategory("unknown"), "all");
  assert.equal(parseCatalogCategory(["women", "men"]), "all");
  assert.equal(parseCatalogCategory(undefined), "all");
});

test("filterCatalogProducts returns only products in the selected category", () => {
  assert.deepEqual(
    filterCatalogProducts(products, "jewelry").map((product) => product.id),
    [6],
  );
  assert.equal(filterCatalogProducts(products, "all"), products);
});

test("getFeaturedProduct prefers the editorial hero product", () => {
  assert.equal(getFeaturedProduct(products)?.id, 3);
  assert.equal(getFeaturedProduct(products.slice(2))?.id, 6);
  assert.equal(getFeaturedProduct([]), null);
});

test("getPopularProducts ranks engagement without mutating the catalog", () => {
  const unsortedProducts = [products[2], products[1], products[0]];

  assert.deepEqual(
    getPopularProducts(unsortedProducts, 2).map((product) => product.id),
    [1, 3],
  );
  assert.deepEqual(
    unsortedProducts.map((product) => product.id),
    [6, 3, 1],
  );
});
