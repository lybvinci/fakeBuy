import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Flame, Timer, Ticket, BadgePercent, Gift, Zap } from "lucide-react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import PageTransition from "@/components/layout/PageTransition";
import PriceTag from "@/components/product/PriceTag";
import ProductSkeleton from "@/components/product/ProductSkeleton";
import { listProducts } from "@/api/dummy";
import { adaptProduct } from "@/api/adapter";
import { useAsync } from "@/hooks/useAsync";
import {
  couponTemplates,
  describeCoupon,
  type CouponTemplate,
} from "@/data/coupons";
import { useCouponStore } from "@/stores/useCouponStore";
import { useScrollTop } from "@/hooks/useScrollTop";
import { shortNumber } from "@/utils/format";
import { cn } from "@/lib/utils";

function useCountdown(target: number): string {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function CouponCard({ coupon }: { coupon: CouponTemplate }) {
  const claim = useCouponStore((s) => s.claim);
  const claimed = useCouponStore((s) => s.claimed.includes(coupon.id));
  const progress = Math.min(100, Math.round((coupon.claimed / coupon.total) * 100));
  const desc = describeCoupon(coupon);
  return (
    <div className="relative flex items-stretch border border-ink bg-cream overflow-hidden">
      {/* 票根 */}
      <div className="w-32 shrink-0 bg-vermilion text-cream p-3 flex flex-col items-center justify-center text-center">
        {coupon.kind === "threshold" ? (
          <>
            <div className="text-mono text-xs opacity-90">¥</div>
            <div className="text-display text-4xl leading-none">{coupon.value}</div>
            <div className="text-xs mt-1">
              {coupon.threshold > 0 ? `满 ${coupon.threshold} 可用` : "无门槛"}
            </div>
          </>
        ) : coupon.kind === "discount" ? (
          <>
            <div className="text-display text-4xl leading-none">
              {(coupon.value * 10).toFixed(1)}
              <span className="text-base ml-0.5">折</span>
            </div>
            <div className="text-xs mt-1">满 {coupon.threshold} 可用</div>
          </>
        ) : (
          <>
            <Gift size={26} />
            <div className="text-sm mt-1">包邮券</div>
          </>
        )}
      </div>
      {/* 中段虚线 */}
      <div className="relative w-3 border-l border-r border-ink bg-paper">
        <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cream border border-ink" />
        <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-cream border border-ink" />
      </div>
      {/* 内容 */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div>
          <div className="font-serif text-base">{coupon.name}</div>
          <div className="mt-0.5 text-xs text-ink/55">{coupon.scope}</div>
          <div className="mt-1 text-mono text-[11px] text-vermilion">{desc}</div>
        </div>
        <div className="mt-2">
          <div className="h-1.5 bg-paper border border-ink/20 overflow-hidden">
            <div
              className="h-full bg-vermilion transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-mono text-[10px] text-ink/55">
              已抢 {progress}%
            </span>
            <button
              onClick={() => claim(coupon.id)}
              disabled={claimed}
              className={cn(
                "text-xs px-3 py-1 border transition-colors",
                claimed
                  ? "bg-paper text-ink/40 border-ink/30 cursor-not-allowed"
                  : "bg-ink text-cream border-ink hover:bg-vermilion hover:border-vermilion",
              )}
            >
              {claimed ? "已领取" : "立即领取"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Deals() {
  useScrollTop();

  // 百亿补贴：评分最高 + 折扣明显
  const subsidy = useAsync(
    () =>
      listProducts({ limit: 30, sortBy: "rating", order: "desc" }).then((r) =>
        r.products.map(adaptProduct).filter((p) => p.originalPrice).slice(0, 8),
      ),
    [],
  );
  // 限时秒杀：随机一批
  const flashSale = useAsync(
    () =>
      listProducts({ limit: 24, sortBy: "price", order: "desc" }).then((r) =>
        r.products.map(adaptProduct).slice(0, 6),
      ),
    [],
  );
  // 今日特惠：评分倒序
  const todays = useAsync(
    () =>
      listProducts({ limit: 30 }).then((r) => r.products.map(adaptProduct).slice(8, 26)),
    [],
  );

  // 限时秒杀：今晚 24:00 截止
  const flashDeadline = useMemo(() => {
    const d = new Date();
    d.setHours(23, 59, 59, 999);
    return d.getTime();
  }, []);
  const flashCountdown = useCountdown(flashDeadline);

  return (
    <AppLayout>
      <PageTransition>
        {/* HERO 百亿补贴 */}
        <section className="relative overflow-hidden">
          <div className="container py-6 lg:py-10">
            <div className="relative border border-ink bg-vermilion text-cream overflow-hidden">
              <div className="absolute inset-0 opacity-15 mix-blend-screen"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 30%, #FAF6EE 0, transparent 40%), radial-gradient(circle at 70% 70%, #FAF6EE 0, transparent 35%)",
                }}
              />
              <div className="relative p-8 lg:p-14 grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
                <div>
                  <div className="inline-flex items-center gap-2 text-mono text-xs tracking-widest bg-cream/15 px-3 py-1">
                    <Flame size={14} />
                    OFFICIAL SUBSIDY · 2026
                  </div>
                  <h1 className="mt-3 text-display text-5xl sm:text-7xl lg:text-[112px] leading-[0.9] tracking-tightest">
                    百亿补贴
                  </h1>
                  <p className="mt-3 font-serif text-xl">
                    每天 100,000,000 元真金白银，直补到底。
                  </p>
                  <p className="mt-1 text-sm text-cream/80">
                    iPhone、笔记本、轻奢腕表，全场低于市价 30%。
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link
                      to="/category/smartphones"
                      className="btn-base bg-cream text-vermilion border border-cream hover:bg-ink hover:text-cream hover:border-ink"
                    >
                      <Zap size={16} />
                      去抢补贴
                    </Link>
                    <a
                      href="#coupons"
                      className="btn-base border border-cream/60 text-cream hover:bg-cream/10"
                    >
                      <Ticket size={16} />
                      领满减券
                    </a>
                  </div>
                </div>
                <div className="hidden lg:flex justify-end">
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    {(subsidy.data ?? []).slice(0, 4).map((p) => (
                      <Link
                        key={p.id}
                        to={`/product/${p.id}`}
                        className="bg-cream border border-cream p-2 group"
                      >
                        <div className="aspect-square overflow-hidden bg-cream">
                          <img
                            src={p.cover}
                            alt={p.title}
                            className="w-full h-full object-contain transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="mt-1 text-[11px] text-ink line-clamp-1">{p.title}</div>
                        <div className="text-mono text-sm text-vermilion">¥{p.price.toFixed(2)}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 限时秒杀 */}
        <section className="container pb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="text-mono text-xs tracking-widest text-vermilion">FLASH SALE · 01</div>
              <h2 className="text-display text-3xl lg:text-4xl mt-1 flex items-center gap-3">
                <Timer size={26} className="text-vermilion" />
                限时秒杀
              </h2>
            </div>
            <div className="hairline bg-paper px-3 py-1.5 text-mono text-sm">
              距结束 <span className="text-vermilion text-base ml-1">{flashCountdown}</span>
            </div>
          </div>
          {flashSale.loading ? (
            <ProductSkeleton count={6} columns={3} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
              {(flashSale.data ?? []).map((p, idx) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group block hairline bg-cream"
                >
                  <div className="relative aspect-square bg-paper overflow-hidden">
                    <img
                      src={p.cover}
                      alt={p.title}
                      className="w-full h-full object-contain p-2 transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-vermilion text-cream text-[10px] tracking-widest">
                      限时
                    </div>
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-ink text-cream text-mono text-[10px]">
                      0{idx + 1}
                    </div>
                  </div>
                  <div className="p-2.5 border-t border-ink">
                    <div className="text-xs line-clamp-2 min-h-[2rem]">{p.title}</div>
                    <div className="mt-1 flex items-end justify-between gap-1">
                      <PriceTag value={p.price} size="sm" />
                      {p.originalPrice && (
                        <span className="text-mono text-[10px] text-ink/40 line-through">
                          ¥{p.originalPrice.toFixed(0)}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 h-1 bg-paper border border-ink/20 overflow-hidden">
                      <div
                        className="h-full bg-vermilion"
                        style={{ width: `${50 + (idx * 7) % 45}%` }}
                      />
                    </div>
                    <div className="text-mono text-[10px] text-ink/55 mt-0.5">
                      已抢 {shortNumber(800 + idx * 137)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 优惠券 */}
        <section id="coupons" className="container pb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="text-mono text-xs tracking-widest text-vermilion">COUPONS · 02</div>
              <h2 className="text-display text-3xl lg:text-4xl mt-1 flex items-center gap-3">
                <BadgePercent size={26} className="text-vermilion" />
                领券中心
              </h2>
              <p className="mt-2 text-sm text-ink/55">先领券后下单，结算时自动抵扣</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {couponTemplates.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <CouponCard coupon={c} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* 百亿补贴商品 */}
        <section className="container pb-12">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="text-mono text-xs tracking-widest text-vermilion">SUBSIDY · 03</div>
              <h2 className="text-display text-3xl lg:text-4xl mt-1">百亿补贴专区</h2>
            </div>
          </div>
          {subsidy.loading ? (
            <ProductSkeleton count={8} columns={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
              {(subsidy.data ?? []).map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group block hairline bg-cream"
                >
                  <div className="relative aspect-square bg-paper overflow-hidden">
                    <img
                      src={p.cover}
                      alt={p.title}
                      className="w-full h-full object-contain p-3 transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-vermilion text-cream text-[10px] tracking-widest">
                      百亿补贴
                    </div>
                  </div>
                  <div className="p-3 border-t border-ink">
                    <div className="text-sm line-clamp-2 min-h-[2.5rem]">{p.title}</div>
                    <div className="mt-1.5 text-xs text-ink/55">{p.brand}</div>
                    <div className="mt-2 flex items-end justify-between gap-1">
                      <PriceTag value={p.price} size="md" />
                      {p.originalPrice && (
                        <span className="text-mono text-[10px] text-ink/40 line-through">
                          ¥{p.originalPrice.toFixed(0)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* 今日特惠瀑布流 */}
        <section className="container pb-20">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="text-mono text-xs tracking-widest text-vermilion">TODAY · 04</div>
              <h2 className="text-display text-3xl lg:text-4xl mt-1">今日特惠</h2>
            </div>
          </div>
          {todays.loading ? (
            <ProductSkeleton count={8} columns={4} />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
              {(todays.data ?? []).map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group block hairline bg-cream"
                >
                  <div className="aspect-square bg-paper overflow-hidden">
                    <img
                      src={p.cover}
                      alt={p.title}
                      className="w-full h-full object-contain p-3 transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3 border-t border-ink">
                    <div className="text-sm line-clamp-2 min-h-[2.5rem]">{p.title}</div>
                    <div className="mt-2 flex items-end justify-between gap-1">
                      <PriceTag value={p.price} size="md" />
                      <span className="text-mono text-xs text-ink/45">
                        已售 {shortNumber(p.sales)}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </PageTransition>
    </AppLayout>
  );
}
