import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Address,
  CartItem,
  LogisticsNode,
  Order,
  OrderAmount,
  OrderStatus,
  PaymentMethod,
} from "@/types";
import { newOrderId } from "@/utils/id";
import { initialLogistics, nextLogisticsNode } from "@/utils/logistics";

interface CreateOrderInput {
  items: CartItem[];
  address: Address;
  amount: OrderAmount;
  remark?: string;
}

interface OrderState {
  list: Order[];
  create: (input: CreateOrderInput) => Order;
  payOrder: (orderId: string, method: PaymentMethod) => Order | undefined;
  pushLogistics: (orderId: string) => Order | undefined;
  getById: (orderId: string) => Order | undefined;
  setStatus: (orderId: string, status: OrderStatus) => void;
  cancel: (orderId: string) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      list: [],
      create: ({ items, address, amount, remark }) => {
        const order: Order = {
          id: newOrderId(),
          status: "pending_pay",
          items,
          address,
          amount,
          createdAt: Date.now(),
          logistics: [],
          remark,
        };
        set({ list: [order, ...get().list] });
        return order;
      },
      payOrder: (orderId, method) => {
        let result: Order | undefined;
        set({
          list: get().list.map((o) => {
            if (o.id !== orderId) return o;
            const next: Order = {
              ...o,
              status: "shipped",
              paymentMethod: method,
              paidAt: Date.now(),
              logistics: initialLogistics(),
            };
            result = next;
            return next;
          }),
        });
        return result;
      },
      pushLogistics: (orderId) => {
        let result: Order | undefined;
        set({
          list: get().list.map((o) => {
            if (o.id !== orderId) return o;
            const node: LogisticsNode = nextLogisticsNode(o.logistics);
            const logistics = [...o.logistics, node];
            result = { ...o, logistics };
            return result;
          }),
        });
        return result;
      },
      getById: (orderId) => get().list.find((o) => o.id === orderId),
      setStatus: (orderId, status) => {
        set({
          list: get().list.map((o) =>
            o.id === orderId ? { ...o, status } : o,
          ),
        });
      },
      cancel: (orderId) => {
        set({ list: get().list.filter((o) => o.id !== orderId) });
      },
    }),
    { name: "fb_orders" },
  ),
);
