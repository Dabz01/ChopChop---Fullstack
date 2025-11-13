'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import type { MenuItem } from '@/lib/types';

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  restaurantId: string | null;
  addItem: (menuItem: MenuItem, restaurantId: string) => void;
  removeItem: (menuItemId: string) => void;
  clear: () => void;
  totalKobo: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  const addItem = (menuItem: MenuItem, rId: string) => {
    setItems((prev) => {
      if (restaurantId && restaurantId !== rId) {
        setRestaurantId(rId);
        return [{ menuItem, quantity: 1 }];
      }
      if (!restaurantId) setRestaurantId(rId);

      const existing = prev.find((i) => i.menuItem.id === menuItem.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItem.id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { menuItem, quantity: 1 }];
    });
  };

  const removeItem = (menuItemId: string) => {
    setItems((prev) => {
      const next = prev
        .map((i) =>
          i.menuItem.id === menuItemId ? { ...i, quantity: i.quantity - 1 } : i,
        )
        .filter((i) => i.quantity > 0);
      if (next.length === 0) {
        setRestaurantId(null);
      }
      return next;
    });
  };

  const clear = () => {
    setItems([]);
    setRestaurantId(null);
  };

  const totalKobo = useMemo(
    () => items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0),
    [items],
  );

  return (
    <CartContext.Provider
      value={{ items, restaurantId, addItem, removeItem, clear, totalKobo }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartContext');
  return ctx;
};
