import { useEffect, useRef } from "react";
import { useOrderStore } from "@/stores/useOrderStore";

const TICK_INTERVAL_MS = 10_000;

export function useLogisticsTick(orderId: string | undefined): void {
  const pushLogistics = useOrderStore((s) => s.pushLogistics);
  const order = useOrderStore((s) =>
    orderId ? s.list.find((o) => o.id === orderId) : undefined,
  );
  const lastTickRef = useRef<number>(0);

  useEffect(() => {
    if (!order || order.status !== "shipped") return;
    const lastNodeTime = order.logistics[order.logistics.length - 1]?.time ?? order.createdAt;
    const now = Date.now();
    if (now - lastNodeTime > TICK_INTERVAL_MS && now - lastTickRef.current > 2000) {
      lastTickRef.current = now;
      pushLogistics(order.id);
    }
    const timer = window.setInterval(() => {
      lastTickRef.current = Date.now();
      pushLogistics(order.id);
    }, TICK_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [order, pushLogistics]);
}
