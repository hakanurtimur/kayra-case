import type { CartItem } from "@kayra/types";

export type { CartItem, ProductId } from "@kayra/types";

const CART_STORAGE_KEY = "kayra:cart:v1";
const CART_CHANGE_EVENT = "kayra:cart-change:v1";

function getBrowserWindow(): Window | null {
  return typeof window === "undefined" ? null : window;
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isSafeInteger(value) && Number(value) > 0;
}

function normalizeCart(value: unknown): CartItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const quantities = new Map<number, number>();

  for (const item of value) {
    if (
      typeof item !== "object" ||
      item === null ||
      !("productId" in item) ||
      !("quantity" in item) ||
      !isPositiveInteger(item.productId) ||
      !isPositiveInteger(item.quantity)
    ) {
      continue;
    }

    const currentQuantity = quantities.get(item.productId) ?? 0;
    const nextQuantity = currentQuantity + item.quantity;

    if (Number.isSafeInteger(nextQuantity)) {
      quantities.set(item.productId, nextQuantity);
    }
  }

  return Array.from(quantities, ([productId, quantity]) => ({
    productId,
    quantity,
  }));
}

export function readCart(): CartItem[] {
  const browserWindow = getBrowserWindow();

  if (!browserWindow) {
    return [];
  }

  try {
    const storedCart = browserWindow.localStorage.getItem(CART_STORAGE_KEY);
    return storedCart ? normalizeCart(JSON.parse(storedCart)) : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]): void {
  const browserWindow = getBrowserWindow();

  if (!browserWindow) {
    return;
  }

  const normalizedItems = normalizeCart(items);

  try {
    browserWindow.localStorage.setItem(
      CART_STORAGE_KEY,
      JSON.stringify(normalizedItems),
    );
  } catch {
    // Subscribers still receive the attempted same-document state change.
  }

  browserWindow.dispatchEvent(new CustomEvent(CART_CHANGE_EVENT));
}

export function addToCart(productId: number, quantity = 1): CartItem[] {
  const items = readCart();

  if (!isPositiveInteger(productId) || !isPositiveInteger(quantity)) {
    return items;
  }

  const existingItem = items.find((item) => item.productId === productId);
  const nextItems = existingItem
    ? items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      )
    : [...items, { productId, quantity }];

  writeCart(nextItems);
  return normalizeCart(nextItems);
}

export function updateCartItem(
  productId: number,
  quantity: number,
): CartItem[] {
  const items = readCart();

  if (!isPositiveInteger(productId)) {
    return items;
  }

  if (Number.isFinite(quantity) && quantity <= 0) {
    return removeFromCart(productId);
  }

  if (!isPositiveInteger(quantity)) {
    return items;
  }

  const nextItems = items.map((item) =>
    item.productId === productId ? { ...item, quantity } : item,
  );

  writeCart(nextItems);
  return normalizeCart(nextItems);
}

export function removeFromCart(productId: number): CartItem[] {
  const items = readCart();

  if (!isPositiveInteger(productId)) {
    return items;
  }

  const nextItems = items.filter((item) => item.productId !== productId);
  writeCart(nextItems);
  return nextItems;
}

export function clearCart(): void {
  writeCart([]);
}

export function subscribeToCartChanges(listener: () => void): () => void {
  const browserWindow = getBrowserWindow();

  if (!browserWindow) {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === CART_STORAGE_KEY || event.key === null) {
      listener();
    }
  };

  browserWindow.addEventListener(CART_CHANGE_EVENT, listener);
  browserWindow.addEventListener("storage", handleStorage);

  return () => {
    browserWindow.removeEventListener(CART_CHANGE_EVENT, listener);
    browserWindow.removeEventListener("storage", handleStorage);
  };
}

export function getCartItemCount(items: CartItem[]): number {
  return normalizeCart(items).reduce(
    (total, item) => total + item.quantity,
    0,
  );
}
