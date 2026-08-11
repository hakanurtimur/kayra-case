"use client";

import { useEffect, useState } from "react";
import {
  readCart,
  subscribeToCartChanges,
  type CartItem,
} from "@kayra/cart-contract";

export function useCartItems() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const syncCart = () => {
      setItems(readCart());
    };

    syncCart();
    return subscribeToCartChanges(syncCart);
  }, []);

  return items;
}
