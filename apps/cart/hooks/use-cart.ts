"use client";

import { useEffect, useState } from "react";
import {
  readCart,
  subscribeToCartChanges,
  type CartItem,
} from "@kayra/cart-contract";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const syncCart = () => {
      setItems(readCart());
    };

    syncCart();
    setIsHydrated(true);

    return subscribeToCartChanges(syncCart);
  }, []);

  return {
    isHydrated,
    items,
  };
}
