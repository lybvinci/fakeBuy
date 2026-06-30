import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Truck, MapPin } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PageTransition from "@/components/layout/PageTransition";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import { useOrderStore } from "@/stores/useOrderStore";
import { useLogisticsTick } from "@/hooks/useLogisticsTick";
import { formatPrice, formatTime } from "@/utils/format";

export default function OrderDetail() {
  const { orderId = "" } = useParams();
  const navigate = useNavigate();
  const order = useOrderStore((s) => s.list.find((o) => o.id === orderId));
  useLogisticsTick(orderId);

  if (!order) {
    return (
      <AppLayout>
        <div className="container py-20">
          <EmptyState
            title="找不到这个订单"
            desc="可能从未存在过"
            action={<Button onClick={() => navigate("/orders")}>我的订单</Button>}
          />
        </div>
      </AppLayout>
    );
  }

  const reversed = [...order.logistics].reverse();

  return (
    <AppLayout>
      <PageTransition>
        <div className="container py-10 lg:py-14">
          <nav className="text-mono text-xs text-ink/50 mb-2">
            <Link to="/orders" className="hover:text-vermilion">我的订单</Link>
            <span className="mx-2">/</span>
            <span>{order.id}</span>
          </nav>
          <div className="text-mono text-xs tracking-widest text-vermilion">ORDER DETAIL</div>
          <h1 className="text-display text-3xl lg:text-5xl mt-1">
            {order.status === "pending_pay" ? "订单待支付" : "包裹运输中"}
          </h1>

          <div className="mt-8 grid grid-cols-12 gap-6">
            {/* MAIN */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              {/* LOGISTICS */}
              {order.status === "shipped" && (
                <section className="hairline bg-cream">
                  <header className="px-5 py-3 border-b border-ink flex items-center justify-between">
                    <h2 className="font-serif text-lg flex items-center gap-2">
                      <Truck size={16} />
                      物流追踪
                    </h2>
                    <span className="text-[10px] px-2 py-0.5 tracking-widest uppercase bg-vermilion text-cream">
                      运输中
                    </span>
                  </header>
                  <div className="p-6">
                    <ul className="space-y-5">
                      {reversed.map((node, idx) => {
                        const isLatest = idx === 0;
                        return (
                          <motion.li
                            key={`${node.time}-${idx}`}
                            initial={isLatest ? { opacity: 0, y: 6 } : undefined}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className="grid grid-cols-[120px_1fr] gap-4 items-start"
                          >
                            <div className="text-mono text-xs text-ink/55 text-right pt-1">
                              {formatTime(node.time, "MM-DD HH:mm:ss")}
                            </div>
                            <div className="relative pl-6 border-l border-ink/20 pb-1">
                              <span
                                className={`absolute -left-[7px] top-1 w-3.5 h-3.5 rounded-full border-2 ${
                                  isLatest
                                    ? "border-vermilion bg-vermilion animate-breathe"
                                    : "border-ink bg-cream"
                                }`}
                              />
                              <div className={`text-sm font-medium ${isLatest ? "text-vermilion" : "text-ink"}`}>
                                {isLatest && <span className="mr-1">🚚</span>}
                                {node.title}
                              </div>
                              {node.desc && (
                                <div className="text-xs text-ink/55 mt-0.5">{node.desc}</div>
                              )}
                            </div>
                          </motion.li>
                        );
                      })}
                    </ul>
                    <div className="mt-6 text-center text-xs text-ink/40 italic font-serif">
                      包裹正在派送途中，请耐心等待 🚚
                    </div>
                  </div>
                </section>
              )}

              {/* ADDRESS */}
              <section className="hairline bg-cream p-5">
                <h2 className="font-serif text-lg flex items-center gap-2 mb-3">
                  <MapPin size={16} />
                  收货地址
                </h2>
                <div className="text-sm">
                  <span className="font-medium">{order.address.name}</span>
                  <span className="ml-3 text-mono text-ink/60">{order.address.phone}</span>
                </div>
                <div className="mt-1 text-sm text-ink/70">
                  {order.address.region}・{order.address.detail}
                </div>
              </section>

              {/* ITEMS */}
              <section className="hairline bg-cream">
                <header className="px-5 py-3 border-b border-ink">
                  <h2 className="font-serif text-lg">商品清单</h2>
                </header>
                <ul>
                  {order.items.map((it) => (
                    <li
                      key={it.id}
                      className="flex items-center gap-4 px-5 py-4 border-b border-ink/10 last:border-b-0"
                    >
                      <Link
                        to={`/product/${it.productId}`}
                        className="w-16 h-16 border border-ink bg-paper overflow-hidden shrink-0"
                      >
                        <img src={it.snapshot.cover} alt={it.snapshot.title} className="w-full h-full object-contain p-1" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${it.productId}`}
                          className="font-serif text-sm line-clamp-1 hover:text-vermilion"
                        >
                          {it.snapshot.title}
                        </Link>
                        <div className="text-xs text-ink/55 mt-0.5">
                          {Object.keys(it.spec).length > 0
                            ? `${Object.entries(it.spec).map(([k, v]) => `${k}: ${v}`).join(" / ")} · x${it.quantity}`
                            : `x${it.quantity}`}
                        </div>
                      </div>
                      <div className="text-mono text-sm text-vermilion">
                        {formatPrice(it.snapshot.price * it.quantity)}
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* SIDE */}
            <aside className="col-span-12 lg:col-span-4 space-y-4">
              <div className="hairline bg-paper p-5 text-sm">
                <div className="text-mono text-xs tracking-widest text-ink/55">SUMMARY</div>
                <dl className="mt-3 space-y-1.5">
                  <div className="flex justify-between">
                    <dt className="text-ink/60">订单编号</dt>
                    <dd className="text-mono">{order.id}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink/60">下单时间</dt>
                    <dd className="text-mono">{formatTime(order.createdAt, "MM-DD HH:mm")}</dd>
                  </div>
                  {order.paidAt && (
                    <div className="flex justify-between">
                      <dt className="text-ink/60">支付时间</dt>
                      <dd className="text-mono">{formatTime(order.paidAt, "MM-DD HH:mm")}</dd>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <dt className="text-ink/60">商品金额</dt>
                    <dd className="text-mono">{formatPrice(order.amount.goods)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink/60">运费</dt>
                    <dd className="text-mono">{formatPrice(order.amount.shipping)}</dd>
                  </div>
                  {order.amount.discount > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-ink/60">优惠</dt>
                      <dd className="text-mono text-vermilion">- {formatPrice(order.amount.discount)}</dd>
                    </div>
                  )}
                </dl>
                <div className="mt-4 pt-3 border-t border-ink/30 flex items-end justify-between">
                  <span className="text-sm text-ink/60">实付金额</span>
                  <span className="text-mono text-3xl text-vermilion">
                    {formatPrice(order.amount.total)}
                  </span>
                </div>
                {order.remark && (
                  <div className="mt-3 text-xs text-ink/55">备注：{order.remark}</div>
                )}
              </div>

              {order.status === "pending_pay" ? (
                <Button block size="lg" onClick={() => navigate(`/payment/${order.id}`)}>
                  去支付
                </Button>
              ) : (
                <Link to="/" className="btn-base block text-center border border-ink hover:bg-ink hover:text-cream">
                  继续购物
                </Link>
              )}
            </aside>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
