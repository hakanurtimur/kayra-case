import type { CartItem, Product } from "@kayra/types";

export type CartLine = {
  product: Product;
  quantity: number;
  lineTotal: number;
};

export function createCartLines(
  items: CartItem[],
  products: Product[],
): CartLine[] {
  const productsById = new Map(
    products.map((product) => [product.id, product]),
  );

  return items.flatMap((item) => {
    const product = productsById.get(item.productId);

    return product
      ? [
          {
            product,
            quantity: item.quantity,
            lineTotal: product.price * item.quantity,
          },
        ]
      : [];
  });
}
