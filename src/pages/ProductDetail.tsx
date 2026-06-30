import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  PackageCheck,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PageTransition from "@/components/layout/PageTransition";
import PriceTag from "@/components/product/PriceTag";
import QuantityStepper from "@/components/common/QuantityStepper";
import Stars from "@/components/common/Stars";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/common/Button";
import ProductGrid from "@/components/product/ProductGrid";
import ProductSkeleton from "@/components/product/ProductSkeleton";
import { useScrollTop } from "@/hooks/useScrollTop";
import { useAsync } from "@/hooks/useAsync";
import { getProduct, listProductsByCategory, type ApiProduct, type ApiReview } from "@/api/dummy";
import { adaptProduct, toCNY } from "@/api/adapter";
import {
  localizeAvailability,
  localizeReturn,
  localizeReviewComment,
  localizeReviewerName,
  localizeShipping,
  localizeWarranty,
} from "@/api/i18n";
import { useCartStore } from "@/stores/useCartStore";
import { shortNumber, timeAgo } from "@/utils/format";
import { flyToCart } from "@/utils/flyToCart";
import { getCategory } from "@/data/categories";

export default function ProductDetail() {
  useScrollTop();
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const numId = Number(id);

  const detail = useAsync<ApiProduct>(() => getProduct(numId), [numId]);
  const product = useMemo(
    () => (detail.data ? adaptProduct(detail.data) : undefined),
    [detail.data],
  );

  const related = useAsync(
    () =>
      detail.data
        ? listProductsByCategory(detail.data.category, { limit: 8 }).then((r) =>
            r.products.map(adaptProduct).filter((p) => p.id !== id),
          )
        : Promise.resolve([]),
    [detail.data?.category, id],
  );

  const addItem = useCartStore((s) => s.addItem);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setActiveImg(0);
    setQuantity(detail.data?.minimumOrderQuantity ?? 1);
  }, [detail.data]);

  if (detail.loading) {
    return (
      <AppLayout>
        <div className="container py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
            <div className="aspect-square bg-paper border border-ink animate-pulse" />
            <div className="space-y-3">
              <div className="h-3 w-24 bg-paper animate-pulse" />
              <div className="h-10 w-3/4 bg-paper animate-pulse" />
              <div className="h-4 w-2/3 bg-paper animate-pulse" />
              <div className="h-24 bg-paper animate-pulse" />
              <div className="h-32 bg-paper animate-pulse" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!detail.data || !product) {
    return (
      <AppLayout>
        <div className="container py-20">
          <EmptyState
            title="商品不存在"
            desc="该商品可能已下架"
            action={<Button onClick={() => navigate("/")}>回到首页</Button>}
          />
        </div>
      </AppLayout>
    );
  }

  const raw = detail.data;
  const reviews: ApiReview[] = raw.reviews ?? [];
  const category = getCategory(raw.category);
  const categoryName = category?.name ?? raw.category;
  const minQty = raw.minimumOrderQuantity ?? 1;

  function handleAddCart() {
    if (!product) return;
    addItem({ product, spec: {}, quantity });
    const img = document.getElementById("pd-main-img") as HTMLImageElement | null;
    if (img) flyToCart(img);
  }

  function handleBuyNow() {
    if (!product) return;
    const item = addItem({ product, spec: {}, quantity });
    useCartStore.setState((state) => ({
      items: state.items.map((it) => ({
        ...it,
        selected: it.id === item.id,
      })),
    }));
    navigate("/checkout");
  }

  return (
    <AppLayout>
      <PageTransition>
        <div className="container py-8 lg:py-12">
          <nav className="text-mono text-xs text-ink/50 mb-4">
            <Link to="/" className="hover:text-vermilion">首页</Link>
            <span className="mx-2">/</span>
            <Link to={`/category/${raw.category}`} className="hover:text-vermilion">
              {categoryName}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink/70">{product.title}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
            <div>
              <div className="aspect-square hairline bg-paper overflow-hidden group">
                <img
                  id="pd-main-img"
                  src={product.images[activeImg] ?? product.cover}
                  alt={product.title}
                  className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              {product.images.length > 1 && (
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {product.images.map((src, i) => (
                    <button
                      key={src + i}
                      onClick={() => setActiveImg(i)}
                      className={`aspect-square overflow-hidden border bg-paper ${
                        i === activeImg ? "border-vermilion" : "border-ink/30"
                      }`}
                    >
                      <img src={src} alt="" className="w-full h-full object-contain p-1" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="text-mono text-xs tracking-widest text-vermilion">
                {raw.brand?.toUpperCase() ?? "OFFICIAL"} · {categoryName}
              </div>
              <h1 className="mt-2 text-display text-4xl lg:text-5xl leading-tight">
                {product.title}
              </h1>
              <p className="mt-2 font-serif text-base text-ink/65 leading-relaxed">
                {product.description[0]}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Stars value={product.rating} showText />
                <span className="text-mono text-xs text-ink/50">
                  {reviews.length} 条评价
                </span>
                <span className="text-mono text-xs text-ink/50">
                  已售 {shortNumber(product.sales)}
                </span>
                <span
                  className={`text-[10px] tracking-widest uppercase px-2 py-0.5 ${
                    raw.stock > 20
                      ? "bg-moss text-cream"
                      : raw.stock > 0
                        ? "bg-mustard text-ink"
                        : "bg-ink/40 text-cream"
                  }`}
                >
                  {localizeAvailability(raw.availabilityStatus, raw.stock)}
                </span>
              </div>

              <div className="mt-6 p-5 bg-paper border border-ink">
                <PriceTag value={product.price} original={product.originalPrice} size="hero" />
                {raw.discountPercentage > 0 && (
                  <div className="mt-1 inline-block text-[11px] tracking-widest uppercase px-2 py-0.5 bg-vermilion text-cream">
                    立省 {raw.discountPercentage.toFixed(1)}%
                  </div>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {product.tags.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      className="text-[11px] tracking-widest uppercase px-2 py-0.5 bg-mustard text-ink"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="text-xs text-ink/55 mb-2 tracking-widest uppercase">
                  数量
                  {minQty > 1 && (
                    <span className="ml-2 text-vermilion text-mono">
                      最少 {minQty} 件起购
                    </span>
                  )}
                </div>
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  min={minQty}
                  max={Math.max(minQty, raw.stock)}
                />
                <div className="mt-1.5 text-xs text-ink/50 text-mono">
                  库存 {raw.stock} 件
                </div>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleAddCart}
                  className="!border-mustard !bg-mustard/20 hover:!bg-mustard hover:!border-mustard"
                  disabled={raw.stock === 0}
                >
                  <ShoppingCart size={16} />
                  加入购物车
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={raw.stock === 0}
                >
                  <Zap size={16} />
                  立即购买
                </Button>
              </div>

              <ul className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-ink/70">
                <li className="flex items-start gap-1.5">
                  <Truck size={14} className="text-moss shrink-0 mt-0.5" />
                  <span>{localizeShipping(raw.shippingInformation)}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <ShieldCheck size={14} className="text-moss shrink-0 mt-0.5" />
                  <span>{localizeWarranty(raw.warrantyInformation)}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <RotateCcw size={14} className="text-moss shrink-0 mt-0.5" />
                  <span>{localizeReturn(raw.returnPolicy)}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <PackageCheck size={14} className="text-moss shrink-0 mt-0.5" />
                  <span>正品保障</span>
                </li>
              </ul>
            </div>
          </div>

          {/* PARAMS */}
          <section className="mt-16 grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 hairline bg-cream p-6">
              <div className="text-mono text-xs tracking-widest text-vermilion">DESCRIPTION</div>
              <h2 className="text-display text-2xl mt-1 mb-3">商品介绍</h2>
              <div className="font-serif text-base leading-relaxed text-ink/85 space-y-3">
                {product.description.map((d, i) => (
                  <p key={i}>
                    <span className="text-mono text-xs text-vermilion mr-2 align-baseline">
                      0{i + 1}
                    </span>
                    {d}
                  </p>
                ))}
              </div>
            </div>
            <div className="hairline bg-paper p-6">
              <div className="text-mono text-xs tracking-widest text-vermilion">SPECIFICATIONS</div>
              <h2 className="text-display text-2xl mt-1 mb-4">参数</h2>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-ink/55">品牌</dt>
                  <dd>{raw.brand ?? "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink/55">SKU</dt>
                  <dd className="text-mono text-xs">{raw.sku}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink/55">分类</dt>
                  <dd>{categoryName}</dd>
                </div>
                {raw.weight !== undefined && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink/55">重量</dt>
                    <dd className="text-mono">{raw.weight} g</dd>
                  </div>
                )}
                {raw.dimensions && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink/55">尺寸</dt>
                    <dd className="text-mono text-xs">
                      {raw.dimensions.width.toFixed(1)} × {raw.dimensions.height.toFixed(1)} ×{" "}
                      {raw.dimensions.depth.toFixed(1)} cm
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <dt className="text-ink/55">库存</dt>
                  <dd className="text-mono">{raw.stock}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-ink/55">评分</dt>
                  <dd className="text-mono">{raw.rating.toFixed(2)} / 5</dd>
                </div>
                {raw.meta?.createdAt && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-ink/55">上架时间</dt>
                    <dd className="text-mono text-xs">
                      {raw.meta.createdAt.slice(0, 10)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-3 pt-2 border-t border-ink/15">
                  <dt className="text-ink/55">原价（参考）</dt>
                  <dd className="text-mono text-ink/45">
                    USD {raw.price.toFixed(2)} · ¥{toCNY(raw.price).toFixed(2)}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          {/* REVIEWS */}
          {reviews.length > 0 && (
            <section className="mt-16">
              <div className="flex items-end justify-between mb-5">
                <div>
                  <div className="text-mono text-xs tracking-widest text-vermilion">REVIEWS</div>
                  <h2 className="text-display text-3xl mt-1">买家评价</h2>
                </div>
                <div className="text-mono text-xs text-ink/50">共 {reviews.length} 条</div>
              </div>
              <ul className="grid md:grid-cols-2 gap-4">
                {reviews.map((r, i) => {
                  const seed = `${r.reviewerEmail}-${i}`;
                  const displayName = localizeReviewerName(seed);
                  const displayComment = localizeReviewComment(r.comment, seed);
                  return (
                    <li key={seed} className="hairline bg-cream p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/notionists-neutral/svg?seed=${encodeURIComponent(seed)}&backgroundColor=faf6ee,e8b547,e6ddc4`}
                          alt={displayName}
                          className="w-10 h-10 rounded-full border border-ink object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm">{displayName}</div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Stars value={r.rating} size={12} />
                            <span className="text-mono text-xs text-ink/45">
                              {timeAgo(new Date(r.date).getTime())}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 font-serif text-base text-ink/85 leading-relaxed">
                        {displayComment}
                      </p>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* RELATED */}
          <section className="mt-16">
            <div className="text-mono text-xs tracking-widest text-vermilion">RELATED</div>
            <h2 className="text-display text-3xl mt-1 mb-6">相关推荐</h2>
            {related.loading ? (
              <ProductSkeleton count={4} columns={4} />
            ) : related.data && related.data.length > 0 ? (
              <ProductGrid products={related.data.slice(0, 8)} columns={4} />
            ) : (
              <div className="text-sm text-ink/50">暂无相关商品</div>
            )}
          </section>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
