import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ScrollText } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PageTransition from "@/components/layout/PageTransition";
import EmptyState from "@/components/common/EmptyState";
import { useOrderStore } from "@/stores/useOrderStore";
import { formatPrice, formatTime } from "@/utils/format";
import type { Order, OrderStatus } from "@/types";

type Tab = "all" | "pending_pay" | "shipped" | "completed";

const tabs: { key: Tab; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "pending_pay", label: "待付款" },
  { key: "shipped", label: "运输中" },
  { key: "completed", label: "已完成" },
];

const statusLabel: Record<OrderStatus, { label: string; cls: string }> = {
  pending_pay: { label: "待付款", cls: "bg-mustard text-ink" },
  paid: { label: "已付款", cls: "bg-moss text-cream" },
  shipped: { label: "运输中", cls: "bg-vermilion text-cream" },
};

export default function Orders() {
  const list = useOrderStore((s) => s.list);
  const [tab, setTab] = useState<Tab>("all");

  const filtered = useMemo<Order[]>(() => {
    if (tab === "all") return list;
    if (tab === "completed") return [];
    return list.filter((o) => o.status === tab);
  }, [list, tab]);

  return (
    <AppLayout>
      <PageTransition>
        <div className="container py-10 lg:py-14">
          <div className="text-mono text-xs tracking-widest text-vermilion">ORDERS</div>
          <h1 className="text-display text-4xl lg:text-6xl mt-1">我的"订单"。</h1>
          <p className="mt-2 text-sm text-ink/55">
            一个零成本的购物记录，所有包裹都在前往传说中的远方。
          </p>

          <div className="mt-8 flex items-center gap-1 border-b border-ink">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2.5 text-sm transition-colors -mb-px border-b-2 ${
                  tab === t.key
                    ? "border-vermilion text-vermilion font-medium"
                    : "border-transparent text-ink/60 hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="mt-12">
              <EmptyState
                title={tab === "completed" ? "暂无已完成订单" : "暂无订单"}
                desc={
                  tab === "completed"
                    ? "你的包裹还在派送途中"
                    : "去首页挑几件喜欢的吧"
                }
                icon={<ScrollText size={28} />}
                action={
                  <Link to="/" className="btn-base bg-ink text-cream">去逛逛</Link>
                }
              />
            </div>
          ) : (
            <ul className="mt-6 space-y-5">
              {filtered.map((o) => {
                const status = statusLabel[o.status];
                return (
                  <li key={o.id} className="hairline bg-cream">
                    <header className="flex items-center justify-between px-5 py-3 border-b border-ink/15">
                      <div className="flex items-center gap-4">
                        <span className="text-mono text-xs text-ink/55">订单号</span>
                        <span className="text-mono text-sm">{o.id}</span>
                        <span className="hidden md:inline text-mono text-xs text-ink/45">
                          {formatTime(o.createdAt, "YYYY-MM-DD HH:mm")}
                        </span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 tracking-widest uppercase ${status.cls}`}>
                        {status.label}
                      </span>
                    </header>
                    <div className="grid grid-cols-12 gap-4 px-5 py-4">
                      <ul className="col-span-12 md:col-span-8 space-y-3">
                        {o.items.slice(0, 2).map((it) => (
                          <li key={it.id} className="flex items-center gap-3">
                            <div className="w-14 h-14 border border-ink bg-paper overflow-hidden">
                              <img src={it.snapshot.cover} alt={it.snapshot.title} className="w-full h-full object-contain p-1" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-serif line-clamp-1">{it.snapshot.title}</div>
                              <div className="text-xs text-ink/55 text-mono">x{it.quantity}</div>
                            </div>
                            <div className="text-mono text-sm">{formatPrice(it.snapshot.price * it.quantity)}</div>
                          </li>
                        ))}
                        {o.items.length > 2 && (
                          <li className="text-xs text-ink/50 text-mono pl-[68px]">
                            …还有 {o.items.length - 2} 件
                          </li>
                        )}
                      </ul>
                      <div className="col-span-12 md:col-span-4 flex flex-col items-end justify-between gap-3 border-t md:border-t-0 md:border-l border-ink/15 md:pl-4 pt-3 md:pt-0">
                        <div className="text-right">
                          <div className="text-xs text-ink/55">合计</div>
                          <div className="text-mono text-2xl text-vermilion">
                            {formatPrice(o.amount.total)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {o.status === "pending_pay" && (
                            <Link
                              to={`/payment/${o.id}`}
                              className="btn-base bg-vermilion text-cream border border-vermilion text-xs"
                            >
                              去支付
                            </Link>
                          )}
                          <Link
                            to={`/orders/${o.id}`}
                            className="btn-base border border-ink text-xs hover:bg-ink hover:text-cream"
                          >
                            查看详情
                          </Link>
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </PageTransition>
    </AppLayout>
  );
}
