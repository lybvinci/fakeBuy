import { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sliders } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PageTransition from "@/components/layout/PageTransition";
import ProductGrid from "@/components/product/ProductGrid";
import ProductSkeleton from "@/components/product/ProductSkeleton";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/common/Button";
import { useAsync } from "@/hooks/useAsync";
import { listProductsByCategory } from "@/api/dummy";
import { adaptProduct } from "@/api/adapter";
import { getCategory } from "@/data/categories";

type Sort = "all" | "sales" | "priceAsc" | "priceDesc";

const sortOptions: { key: Sort; label: string }[] = [
  { key: "all", label: "综合" },
  { key: "sales", label: "评分" },
  { key: "priceAsc", label: "价格 ↑" },
  { key: "priceDesc", label: "价格 ↓" },
];

export default function Category() {
  const { id = "smartphones" } = useParams();
  const navigate = useNavigate();
  const category = getCategory(id);

  const { data, loading, error } = useAsync(
    () =>
      listProductsByCategory(id, { limit: 100 }).then((r) => r.products.map(adaptProduct)),
    [id],
  );

  const all = useMemo(() => data ?? [], [data]);
  const brands = useMemo(() => {
    const set = new Set(all.map((p) => p.brand).filter((b) => b && b !== "—"));
    return Array.from(set);
  }, [all]);

  const [sort, setSort] = useState<Sort>("all");
  const [pickedBrands, setPickedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

  const filtered = useMemo(() => {
    let list = all.filter((p) =>
      pickedBrands.length === 0 ? true : pickedBrands.includes(p.brand),
    );
    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (sort === "sales") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [all, pickedBrands, priceRange, sort]);

  if (!category) {
    return (
      <AppLayout>
        <div className="container py-20">
          <EmptyState
            title="未找到该分类"
            desc="可能链接有误"
            action={<Button onClick={() => navigate("/")}>回到首页</Button>}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageTransition>
        <section className="container pt-10 lg:pt-14">
          <div className="text-mono text-xs tracking-widest text-vermilion">CATEGORY</div>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-display text-5xl lg:text-7xl">{category.name}</h1>
            <p className="font-serif text-base text-ink/60">{category.slogan}</p>
          </div>
          <div className="mt-3 text-mono text-xs text-ink/40">
            {loading ? "加载中…" : `${filtered.length} / ${all.length} 件商品`}
          </div>
        </section>

        <section className="container mt-8 grid grid-cols-12 gap-6 pb-20">
          <aside className="col-span-12 lg:col-span-3 space-y-6 lg:sticky lg:top-32 self-start">
            <div className="surface-paper p-4">
              <div className="flex items-center gap-2 mb-3">
                <Sliders size={14} />
                <h3 className="font-serif text-lg">筛选</h3>
              </div>
              <div className="space-y-5">
                <div>
                  <div className="text-xs text-ink/55 mb-2 tracking-widest uppercase">价格</div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={priceRange[0]}
                      onChange={(e) =>
                        setPriceRange([Number(e.target.value) || 0, priceRange[1]])
                      }
                      className="w-full text-mono px-2 py-1.5 border border-ink bg-cream text-sm"
                    />
                    <span className="text-ink/40">—</span>
                    <input
                      type="number"
                      min={0}
                      value={priceRange[1]}
                      onChange={(e) =>
                        setPriceRange([priceRange[0], Number(e.target.value) || 100000])
                      }
                      className="w-full text-mono px-2 py-1.5 border border-ink bg-cream text-sm"
                    />
                  </div>
                </div>
                {brands.length > 0 && (
                  <div>
                    <div className="text-xs text-ink/55 mb-2 tracking-widest uppercase">品牌</div>
                    <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
                      {brands.map((b) => {
                        const active = pickedBrands.includes(b);
                        return (
                          <button
                            key={b}
                            onClick={() =>
                              setPickedBrands((prev) =>
                                prev.includes(b)
                                  ? prev.filter((x) => x !== b)
                                  : [...prev, b],
                              )
                            }
                            className={`text-xs px-2 py-1.5 border transition-colors truncate ${
                              active
                                ? "bg-ink text-cream border-ink"
                                : "bg-cream border-ink/30 hover:border-ink"
                            }`}
                          >
                            {b}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                {(pickedBrands.length > 0 ||
                  priceRange[0] !== 0 ||
                  priceRange[1] !== 100000) && (
                  <button
                    onClick={() => {
                      setPickedBrands([]);
                      setPriceRange([0, 100000]);
                    }}
                    className="w-full text-xs underline underline-offset-4 text-ink/60 hover:text-vermilion"
                  >
                    清除筛选
                  </button>
                )}
              </div>
            </div>
          </aside>

          <div className="col-span-12 lg:col-span-9">
            <div className="flex items-center justify-between border-y border-ink py-2 mb-6">
              <ul className="flex items-center gap-1">
                {sortOptions.map((opt) => (
                  <li key={opt.key}>
                    <button
                      onClick={() => setSort(opt.key)}
                      className={`px-3 py-1 text-sm ${
                        sort === opt.key
                          ? "bg-vermilion text-cream"
                          : "text-ink/70 hover:text-ink"
                      }`}
                    >
                      {opt.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            {loading ? (
              <ProductSkeleton count={9} columns={3} />
            ) : error ? (
              <EmptyState
                title="加载失败"
                desc="请检查网络后重试"
                action={<Button onClick={() => window.location.reload()}>重新加载</Button>}
              />
            ) : filtered.length > 0 ? (
              <ProductGrid products={filtered} columns={3} />
            ) : (
              <EmptyState
                title="没有匹配的商品"
                desc="换个筛选条件试试"
                action={
                  <Button
                    onClick={() => {
                      setPickedBrands([]);
                      setPriceRange([0, 100000]);
                    }}
                  >
                    清除筛选
                  </Button>
                }
              />
            )}
          </div>
        </section>
      </PageTransition>
    </AppLayout>
  );
}
