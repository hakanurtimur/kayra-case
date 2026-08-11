import type { Product } from "@kayra/types";

const FAKE_STORE_API_URL = "https://fakestoreapi.com";
const PRODUCT_REVALIDATE_SECONDS = 300;

type NextFetchInit = RequestInit & {
  next?: {
    revalidate: number;
  };
};

type FakeStoreFetcher = (
  input: string,
  init: NextFetchInit,
) => Promise<Response>;

const productFetchOptions = {
  next: {
    revalidate: PRODUCT_REVALIDATE_SECONDS,
  },
} satisfies NextFetchInit;

export class ProductApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductApiError";
  }
}

export function parseProductId(value: string) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export async function getProducts(fetcher: FakeStoreFetcher = fetch) {
  const response = await fetcher(
    `${FAKE_STORE_API_URL}/products`,
    productFetchOptions,
  );

  if (!response.ok) {
    throw new ProductApiError("Unable to load products.");
  }

  return (await response.json()) as Product[];
}

async function readJsonOrNull(response: Response) {
  try {
    return (await response.json()) as unknown;
  } catch {
    return null;
  }
}

export async function getProduct(
  productId: number,
  fetcher: FakeStoreFetcher = fetch,
) {
  if (!Number.isInteger(productId) || productId <= 0) {
    return null;
  }

  const response = await fetcher(
    `${FAKE_STORE_API_URL}/products/${productId}`,
    productFetchOptions,
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new ProductApiError("Unable to load product.");
  }

  const product = (await readJsonOrNull(response)) as
    | Product
    | null
    | Record<string, never>;

  if (!product || !("id" in product)) {
    return null;
  }

  return product as Product;
}
