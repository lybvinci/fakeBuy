import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ScanLine, CircleDollarSign } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PageTransition from "@/components/layout/PageTransition";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/common/Button";
import { useOrderStore } from "@/stores/useOrderStore";
import { formatPrice } from "@/utils/format";
import type { PaymentMethod } from "@/types";

const methodNameMap: Record<PaymentMethod, string> = {
  zfb: "支付吧",
  wx: "微星支付",
  bank: "银行卡",
};

export default function Payment() {
  const { orderId = "" } = useParams();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const queryMethod = (params.get("method") as PaymentMethod) || "zfb";
  const order = useOrderStore((s) => s.list.find((o) => o.id === orderId));
  const payOrder = useOrderStore((s) => s.payOrder);

  const [seconds, setSeconds] = useState(5 * 60);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!order || order.status !== "pending_pay") return;
    const t = window.setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [order]);

  useEffect(() => {
    if (order && order.status !== "pending_pay") {
      navigate(`/payment-success/${orderId}`, { replace: true });
    }
  }, [order, orderId, navigate]);

  if (!order) {
    return (
      <AppLayout>
        <div className="container py-20">
          <EmptyState
            title="未找到该订单"
            desc="可能链接有误或订单已关闭"
            action={
              <Button onClick={() => navigate("/orders")}>查看我的订单</Button>
            }
          />
        </div>
      </AppLayout>
    );
  }

  if (order.status !== "pending_pay") {
    return null;
  }

  function handlePay() {
    if (!order) return;
    setPaying(true);
    window.setTimeout(() => {
      payOrder(order.id, queryMethod);
      navigate(`/payment-success/${order.id}`, { replace: true });
    }, 1500);
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <AppLayout>
      <PageTransition>
        <div className="container py-12 lg:py-20">
          <div className="text-mono text-xs tracking-widest text-vermilion">PAYMENT</div>
          <h1 className="text-display text-4xl lg:text-6xl mt-1">订单支付。</h1>
          <p className="mt-2 text-sm text-ink/55">
            订单 <span className="text-mono">{order.id}</span> 等待支付，本站为演示用途不会实际扣款。
          </p>

          <div className="mt-10 grid lg:grid-cols-2 gap-10">
            <div className="hairline bg-cream p-8 flex flex-col items-center">
              <div className="text-mono text-xs text-ink/60 tracking-widest">
                {methodNameMap[queryMethod]} · SCAN TO PAY
              </div>
              <div className="mt-5 relative w-64 h-64 border border-ink bg-cream overflow-hidden grid place-items-center">
                <div className="absolute inset-2 qrcode-grid opacity-60" />
                <div className="absolute inset-0 grid place-items-center">
                  <div className="bg-cream border border-ink p-2">
                    <ScanLine size={42} className="text-vermilion" />
                  </div>
                </div>
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-ink" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-ink" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-ink" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-ink" />
              </div>
              <div className="mt-5 text-sm text-ink/60 text-center font-serif">
                使用手机扫码完成支付
              </div>
              <div className="mt-3 text-mono text-sm">
                剩余时间 <span className="text-vermilion">{mm}:{ss}</span>
              </div>
            </div>

            <div className="hairline bg-paper p-8">
              <div className="text-mono text-xs text-ink/60 tracking-widest mb-3">
                ORDER SUMMARY
              </div>
              <ul className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {order.items.map((it) => (
                  <li key={it.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 border border-ink bg-cream overflow-hidden">
                      <img src={it.snapshot.cover} alt={it.snapshot.title} className="w-full h-full object-contain p-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm line-clamp-1">{it.snapshot.title}</div>
                      <div className="text-xs text-ink/55 text-mono">x{it.quantity}</div>
                    </div>
                    <div className="text-mono text-sm text-vermilion">
                      {formatPrice(it.snapshot.price * it.quantity)}
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-4 border-t border-ink/30 flex items-end justify-between">
                <div className="text-sm text-ink/60">应付金额</div>
                <div className="text-mono text-4xl text-vermilion">
                  {formatPrice(order.amount.total)}
                </div>
              </div>
              <Button
                block
                size="lg"
                loading={paying}
                onClick={handlePay}
                className="mt-6"
              >
                <CircleDollarSign size={18} />
                {paying ? "正在处理…" : "确认支付"}
              </Button>
              <Button
                block
                variant="ghost"
                size="md"
                className="mt-2"
                onClick={() => navigate("/cart")}
              >
                返回购物车
              </Button>
              <p className="mt-4 text-xs text-ink/40 text-mono">
                * 本支付为模拟操作，不会从任何账户扣款。
              </p>
            </div>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
