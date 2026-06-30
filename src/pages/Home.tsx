import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PageTransition from "@/components/layout/PageTransition";
import ProductGrid from "@/components/product/ProductGrid";
import ProductSkeleton from "@/components/product/ProductSkeleton";
import { listProducts } from "@/api/dummy";
import { adaptProduct } from "@/api/adapter";
import { useAsync } from "@/hooks/useAsync";
import { featuredCategories } from "@/data/categories";

const banners = [
  {
    no: "NO.001",
    title: "今日好物。",
    subtitle: "为你精选数千件商品。",
    accent: "从数码、服饰到家居美食，一站搜罗。",
    bg: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=80",
  },
  {
    no: "NO.002",
    title: "Buy Better.",
    subtitle: "好的设计 / 让每一件都值得。",
    accent: "Curated for the everyday.",
    bg: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=2000&q=80",
  },
  {
    no: "NO.003",
    title: "全球品牌，优选直送。",
    subtitle: "好品质，原装正品。",
    accent: "全场满 199 包邮，售后无忧。",
    bg: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=80",
  },
];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % banners.length);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const editorialPicks = useAsync(
    () =>
      listProducts({ limit: 12, sortBy: "rating", order: "desc" }).then((r) =>
        r.products.map(adaptProduct),
      ),
    [],
  );
  const discovery = useAsync(
    () => listProducts({ limit: 24 }).then((r) => r.products.map(adaptProduct)),
    [],
  );

  const editorTop = useMemo(() => editorialPicks.data?.slice(0, 4) ?? [], [editorialPicks.data]);
  const discoveryList = useMemo(() => discovery.data ?? [], [discovery.data]);

  // 用 API 商品的 thumbnail 作为分类封面，每个分类挑一张
  const categoryCover: Record<string, string> = useMemo(() => {
    const map: Record<string, string> = {};
    for (const p of discoveryList) {
      if (!map[p.categoryId]) map[p.categoryId] = p.cover;
    }
    return map;
  }, [discoveryList]);

  return (
    <AppLayout>
      <PageTransition>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-ink">
          <div className="container py-6 lg:py-10">
            <div className="relative h-[460px] lg:h-[560px] overflow-hidden border border-ink">
              {banners.map((b, i) => (
                <div
                  key={b.no}
                  className={`absolute inset-0 transition-all duration-1000 ${
                    i === index ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <img
                    src={b.bg}
                    alt="banner"
                    loading={i === 0 ? "eager" : "lazy"}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-vermilion/55 mix-blend-multiply" />
                  <div className="absolute inset-0 flex flex-col justify-between p-6 lg:p-12 text-cream">
                    <div className="flex items-start justify-between">
                      <div className="text-mono text-xs tracking-widest">{b.no} / 2026</div>
                      <div className="text-mono text-xs tracking-widest hidden sm:block">
                        FAKEBUY EDITORIAL
                      </div>
                    </div>
                    <div>
                      <h1 className="text-display text-[64px] sm:text-[96px] lg:text-[140px] leading-[0.92] tracking-tightest">
                        {b.title}
                      </h1>
                      <p className="mt-4 font-serif text-2xl sm:text-3xl">{b.subtitle}</p>
                      <p className="mt-3 text-sm sm:text-base text-cream/80 max-w-xl">
                        {b.accent}
                      </p>
                      <div className="mt-6 flex items-center gap-3">
                        <Link
                          to="/category/smartphones"
                          className="btn-base bg-cream text-vermilion border border-cream hover:bg-ink hover:border-ink"
                        >
                          开始选购
                          <ArrowRight size={16} />
                        </Link>
                        <Link
                          to="/orders"
                          className="btn-base border border-cream/60 text-cream hover:bg-cream/10"
                        >
                          查看我的订单
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="absolute bottom-4 right-4 flex items-center gap-1.5">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`切换到第 ${i + 1} 张`}
                    onClick={() => setIndex(i)}
                    className={`h-1 transition-all ${
                      i === index ? "w-10 bg-cream" : "w-4 bg-cream/40 hover:bg-cream/70"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <div className="border-y border-ink bg-paper overflow-hidden">
          <div className="flex whitespace-nowrap py-3 animate-marquee">
            {Array.from({ length: 2 }).map((_, k) => (
              <div
                key={k}
                className="flex shrink-0 items-center gap-10 px-6 font-serif text-base text-ink/80"
              >
                <span>· 满 199 包邮 ·</span>
                <span>· 全场 7 天无理由退换 ·</span>
                <span>· 正品保障 售后无忧 ·</span>
                <span>· 顺丰发货 当日下单当日处理 ·</span>
                <span>· 新用户首单立减 30 ·</span>
                <span>· 数千件好物等你来挑 ·</span>
              </div>
            ))}
          </div>
        </div>

        {/* CATEGORIES */}
        <section className="container py-14 lg:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-mono text-xs tracking-widest text-vermilion">CATEGORY · 01</div>
              <h2 className="text-display text-4xl lg:text-5xl mt-1">分类直达。</h2>
            </div>
            <div className="hidden md:block font-serif text-sm text-ink/60 max-w-xs text-right">
              一站找到你想要的东西，无论是数码大件还是日常杂货。
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {featuredCategories.map((c, i) => (
              <Link
                key={c.slug}
                to={`/category/${c.slug}`}
                className="group block hairline bg-cream overflow-hidden hover:shadow-paper transition-shadow"
              >
                <div className="aspect-[4/5] relative overflow-hidden bg-paper">
                  {categoryCover[c.slug] && (
                    <img
                      src={categoryCover[c.slug]}
                      alt={c.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute top-3 left-3 text-mono text-xs text-cream bg-ink/80 px-2 py-0.5">
                    0{i + 1}
                  </div>
                </div>
                <div className="p-3 border-t border-ink flex items-center justify-between">
                  <div>
                    <div className="font-serif text-xl">{c.name}</div>
                    <div className="text-xs text-ink/55 mt-0.5 line-clamp-1">{c.slogan}</div>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-ink/50 group-hover:text-vermilion group-hover:translate-x-1 transition-all"
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* EDITOR PICKS */}
        <section className="container py-10 lg:py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-mono text-xs tracking-widest text-vermilion">EDITORIAL · 02</div>
              <h2 className="text-display text-4xl lg:text-5xl mt-1">编辑精选。</h2>
            </div>
            <div className="hidden md:block font-serif text-sm text-ink/60 max-w-xs text-right">
              评分最高的本周好物，质感与实用并存。
            </div>
          </div>
          {editorialPicks.loading ? (
            <ProductSkeleton count={4} columns={4} />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {editorTop.map((p, i) => (
                <Link
                  key={p.id}
                  to={`/product/${p.id}`}
                  className="group block hairline bg-cream overflow-hidden"
                >
                  <div className="aspect-[4/5] relative overflow-hidden bg-paper">
                    <img
                      src={p.cover}
                      alt={p.title}
                      loading="lazy"
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-cream text-ink text-mono text-xs border border-ink">
                      PICK · 0{i + 1}
                    </div>
                  </div>
                  <div className="p-4 border-t border-ink">
                    <div className="font-serif text-lg leading-tight line-clamp-2">{p.title}</div>
                    <div className="mt-2 text-sm text-ink/60">{p.brand}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* DISCOVERY */}
        <section className="container py-14 lg:py-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-mono text-xs tracking-widest text-vermilion">DISCOVERY · 03</div>
              <h2 className="text-display text-4xl lg:text-5xl mt-1">猜你喜欢。</h2>
            </div>
          </div>
          {discovery.loading ? (
            <ProductSkeleton count={8} columns={4} />
          ) : (
            <ProductGrid products={discoveryList} columns={4} />
          )}
        </section>
      </PageTransition>
    </AppLayout>
  );
}
