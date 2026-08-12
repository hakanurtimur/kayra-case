import type { Product } from "@kayra/types";

export const catalogCategories = [
  { label: "All", slug: "all", value: null },
  { label: "Women", slug: "women", value: "women's clothing" },
  { label: "Men", slug: "men", value: "men's clothing" },
  { label: "Jewelry", slug: "jewelry", value: "jewelery" },
  { label: "Tech", slug: "tech", value: "electronics" },
] as const;

export type CatalogCategory = (typeof catalogCategories)[number]["slug"];

export function parseCatalogCategory(
  value: string | string[] | undefined,
): CatalogCategory {
  if (typeof value !== "string") {
    return "all";
  }

  return catalogCategories.some((category) => category.slug === value)
    ? (value as CatalogCategory)
    : "all";
}

export function filterCatalogProducts(
  products: Product[],
  categorySlug: CatalogCategory,
) {
  const category = catalogCategories.find(
    (candidate) => candidate.slug === categorySlug,
  );

  if (!category?.value) {
    return products;
  }

  return products.filter((product) => product.category === category.value);
}

export function getFeaturedProduct(products: Product[]) {
  return products.find((product) => product.id === 3) ?? products[0] ?? null;
}

export function getPopularProducts(products: Product[], limit = 5) {
  return [...products]
    .sort(
      (first, second) =>
        second.rating.count - first.rating.count ||
        second.rating.rate - first.rating.rate,
    )
    .slice(0, Math.max(0, limit));
}
