import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types";
import { newId } from "@/utils/id";

interface AddItemInput {
  product: Product;
  spec: Record<string, string>;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (input: AddItemInput) => CartItem;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeItem: (itemId: string) => void;
  removeItems: (itemIds: string[]) => void;
  toggleSelect: (itemId: string) => void;
  toggleSelectAll: (selected: boolean) => void;
  clear: () => void;
}

function sameSpec(a: Record<string, string>, b: Record<string, string>): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) {
    if (a[k] !== b[k]) return false;
  }
  return true;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: ({ product, spec, quantity }) => {
        const existing = get().items.find(
          (it) => it.productId === product.id && sameSpec(it.spec, spec),
        );
        if (existing) {
          const next = get().items.map((it) =>
            it.id === existing.id
              ? { ...it, quantity: it.quantity + quantity, selected: true }
              : it,
          );
          set({ items: next });
          return { ...existing, quantity: existing.quantity + quantity };
        }
        const item: CartItem = {
          id: newId(),
          productId: product.id,
          spec,
          quantity,
          selected: true,
          snapshot: {
            title: product.title,
            cover: product.cover,
            price: product.price,
          },
        };
        set({ items: [item, ...get().items] });
        return item;
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((it) =>
            it.id === itemId ? { ...it, quantity } : it,
          ),
        });
      },
      removeItem: (itemId) => {
        set({ items: get().items.filter((it) => it.id !== itemId) });
      },
      removeItems: (itemIds) => {
        const set_ = new Set(itemIds);
        set({ items: get().items.filter((it) => !set_.has(it.id)) });
      },
      toggleSelect: (itemId) => {
        set({
          items: get().items.map((it) =>
            it.id === itemId ? { ...it, selected: !it.selected } : it,
          ),
        });
      },
      toggleSelectAll: (selected) => {
        set({ items: get().items.map((it) => ({ ...it, selected })) });
      },
      clear: () => set({ items: [] }),
    }),
    { name: "fb_cart" },
  ),
);

export function selectCartCount(state: CartState): number {
  return state.items.reduce((sum, it) => sum + it.quantity, 0);
}

export function selectCheckedItems(state: CartState): CartItem[] {
  return state.items.filter((it) => it.selected);
}
