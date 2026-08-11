import type { Product } from "@kayra/types";

const PRODUCTS_URL = "https://fakestoreapi.com/products";

export class ProductApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductApiError";
  }
}

export async function getProducts(
  fetcher: typeof fetch = fetch,
): Promise<Product[]> {
  const response = await fetcher(PRODUCTS_URL);

  if (!response.ok) {
    throw new ProductApiError(
      `Fake Store API request failed with status ${response.status}.`,
    );
  }

  const products: unknown = await response.json();

  if (!Array.isArray(products)) {
    throw new ProductApiError("Fake Store API returned an invalid catalog.");
  }

  return products as Product[];
}
