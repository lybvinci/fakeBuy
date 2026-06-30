import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PageTransition from "@/components/layout/PageTransition";
import EmptyState from "@/components/common/EmptyState";
import QuantityStepper from "@/components/common/QuantityStepper";
import Button from "@/components/common/Button";
import { useCartStore } from "@/stores/useCartStore";
import { formatPrice } from "@/utils/format";

export default function Cart() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const toggleSelect = useCartStore((s) => s.toggleSelect);
  const toggleSelectAll = useCartStore((s) => s.toggleSelectAll);

  const allSelected = items.length > 0 && items.every((it) => it.selected);
  const checkedItems = items.filter((it) => it.selected);
  const checkedCount = checkedItems.reduce((s, it) => s + it.quantity, 0);
  const checkedAmount = checkedItems.reduce(
    (s, it) => s + it.quantity * it.snapshot.price,
    0,
  );

  function checkout() {
    if (checkedItems.length === 0) return;
    navigate("/checkout");
  }

  if (items.length === 0) {
    return (
      <AppLayout>
        <PageTransition>
          <div className="container py-20">
            <EmptyState
              title="购物车空空如也"
              desc="去首页挑几件喜欢的吧"
              icon={<ShoppingBag size={28} />}
              action={
                <Link to="/" className="btn-base bg-ink text-cream">
                  去逛逛
                </Link>
              }
            />
          </div>
        </PageTransition>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageTransition>
        <div className="container py-10 lg:py-14">
          <div className="text-mono text-xs tracking-widest text-vermilion">CART</div>
          <h1 className="text-display text-4xl lg:text-6xl mt-1">购物车。</h1>
          <p className="mt-2 text-sm text-ink/55">
            共 {items.length} 种、合计 {items.reduce((s, it) => s + it.quantity, 0)} 件
          </p>

          <div className="mt-8 hairline bg-cream">
            <div className="grid grid-cols-12 px-4 lg:px-6 py-3 border-b border-ink text-mono text-xs uppercase text-ink/55">
              <div className="col-span-6">商品</div>
              <div className="col-span-2 text-center">单价</div>
              <div className="col-span-2 text-center">数量</div>
              <div className="col-span-2 text-right">小计</div>
            </div>
            <ul>
              {items.map((it) => (
                <li
                  key={it.id}
                  className="grid grid-cols-12 items-center px-4 lg:px-6 py-4 border-b border-ink/15 last:border-b-0"
                >
                  <div className="col-span-6 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={it.selected}
                      onChange={() => toggleSelect(it.id)}
                      className="w-4 h-4 accent-vermilion"
                    />
                    <Link
                      to={`/product/${it.productId}`}
                      className="w-20 h-20 shrink-0 border border-ink bg-paper overflow-hidden"
                    >
                      <img src={it.snapshot.cover} alt={it.snapshot.title} className="w-full h-full object-contain p-1" />
                    </Link>
                    <div className="min-w-0">
                      <Link
                        to={`/product/${it.productId}`}
                        className="font-serif text-base leading-tight line-clamp-2 hover:text-vermilion"
                      >
                        {it.snapshot.title}
                      </Link>
                      {Object.keys(it.spec).length > 0 && (
                        <div className="mt-1 text-xs text-ink/55">
                          {Object.entries(it.spec).map(([k, v]) => `${k}: ${v}`).join(" / ")}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-span-2 text-center text-mono text-sm">
                    {formatPrice(it.snapshot.price)}
                  </div>
                  <div className="col-span-2 grid place-items-center">
                    <QuantityStepper
                      value={it.quantity}
                      onChange={(n) => updateQuantity(it.id, n)}
                      size="sm"
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-end gap-3">
                    <div className="text-mono text-base text-vermilion">
                      {formatPrice(it.quantity * it.snapshot.price)}
                    </div>
                    <button
                      aria-label="删除"
                      onClick={() => removeItem(it.id)}
                      className="text-ink/40 hover:text-vermilion"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* STICKY FOOTER */}
        <div className="sticky bottom-0 z-30 border-t border-ink bg-cream/95 backdrop-blur">
          <div className="container py-4 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => toggleSelectAll(e.target.checked)}
                className="w-4 h-4 accent-vermilion"
              />
              全选
            </label>
            <div className="hidden md:block text-sm text-ink/60">
              已选 <span className="text-mono text-ink">{checkedCount}</span> 件
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-ink/55">合计</div>
                <div className="text-mono text-xl text-vermilion">
                  {formatPrice(checkedAmount)}
                </div>
              </div>
              <Button
                size="lg"
                disabled={checkedItems.length === 0}
                onClick={checkout}
              >
                去结算
              </Button>
            </div>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
