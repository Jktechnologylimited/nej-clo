"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "nej-cart-v1";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  setSize: (productId: string, oldSize: string, newSize: string) => void;
  clear: () => void;
  count: number;
  subtotalCents: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage once on mount. This intentionally sets state
  // inside an effect: the cart starts empty during SSR (localStorage isn't
  // available on the server), so the real value can only be read after the
  // component has mounted in the browser — a lazy useState initializer would
  // read localStorage during the client's hydration render too and cause a
  // server/client mismatch.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from a client-only store, not a derived-state loop
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt storage
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist whenever the cart changes (after initial hydration).
  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === item.productId && i.size === item.size,
      );
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.size === item.size
            ? { ...i, quantity: i.quantity + item.quantity }
            : i,
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size)),
    );
  }, []);

  const setQuantity = useCallback(
    (productId: string, size: string, quantity: number) => {
      setItems((prev) =>
        prev
          .map((i) =>
            i.productId === productId && i.size === size
              ? { ...i, quantity }
              : i,
          )
          .filter((i) => i.quantity > 0),
      );
    },
    [],
  );

  const setSize = useCallback((productId: string, oldSize: string, newSize: string) => {
    if (oldSize === newSize) return;
    setItems((prev) => {
      const moving = prev.find((i) => i.productId === productId && i.size === oldSize);
      if (!moving) return prev;

      const existingAtNewSize = prev.find(
        (i) => i.productId === productId && i.size === newSize,
      );

      if (existingAtNewSize) {
        // Merge into the existing line at the target size, drop the old one.
        return prev
          .map((i) =>
            i.productId === productId && i.size === newSize
              ? { ...i, quantity: i.quantity + moving.quantity }
              : i,
          )
          .filter((i) => !(i.productId === productId && i.size === oldSize));
      }

      return prev.map((i) =>
        i.productId === productId && i.size === oldSize ? { ...i, size: newSize } : i,
      );
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const subtotalCents = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity * i.unitPriceCents, 0),
    [items],
  );

  const value = useMemo(
    () => ({ items, addItem, removeItem, setQuantity, setSize, clear, count, subtotalCents }),
    [items, addItem, removeItem, setQuantity, setSize, clear, count, subtotalCents],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
