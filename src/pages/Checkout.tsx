import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Pencil, Ticket } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PageTransition from "@/components/layout/PageTransition";
import EmptyState from "@/components/common/EmptyState";
import Button from "@/components/common/Button";
import { useCartStore } from "@/stores/useCartStore";
import { useAddressStore } from "@/stores/useAddressStore";
import { useOrderStore } from "@/stores/useOrderStore";
import { useCouponStore } from "@/stores/useCouponStore";
import { formatPrice } from "@/utils/format";
import { calcCouponDiscount, couponTemplates, describeCoupon } from "@/data/coupons";
import type { Address } from "@/types";

type Method = "zfb" | "wx" | "bank";

const methods: { key: Method; label: string; desc: string; mark: string }[] = [
  { key: "zfb", label: "支付宝", desc: "扫码即付，安全便捷", mark: "支" },
  { key: "wx", label: "微信支付", desc: "微信扫一扫付款", mark: "微" },
  { key: "bank", label: "银行卡", desc: "信用卡 / 借记卡", mark: "卡" },
];

interface AddressFormState {
  name: string;
  phone: string;
  region: string;
  detail: string;
  isDefault: boolean;
}

const emptyForm: AddressFormState = {
  name: "",
  phone: "",
  region: "",
  detail: "",
  isDefault: false,
};

export default function Checkout() {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const removeItems = useCartStore((s) => s.removeItems);
  const addressList = useAddressStore((s) => s.list);
  const addAddress = useAddressStore((s) => s.add);
  const createOrder = useOrderStore((s) => s.create);

  const checkedItems = useMemo(() => items.filter((it) => it.selected), [items]);
  const goods = useMemo(
    () => checkedItems.reduce((s, it) => s + it.quantity * it.snapshot.price, 0),
    [checkedItems],
  );

  const claimedIds = useCouponStore((s) => s.claimed);
  const usedIds = useCouponStore((s) => s.used);
  const consumeCoupon = useCouponStore((s) => s.consume);
  const availableCoupons = useMemo(
    () =>
      couponTemplates.filter(
        (c) => claimedIds.includes(c.id) && !usedIds.includes(c.id),
      ),
    [claimedIds, usedIds],
  );
  const [selectedCouponId, setSelectedCouponId] = useState<string>("");

  const selectedCoupon = useMemo(
    () => availableCoupons.find((c) => c.id === selectedCouponId),
    [availableCoupons, selectedCouponId],
  );

  const shipping = selectedCoupon?.kind === "shipping" ? 0 : 0;
  const discount = selectedCoupon ? calcCouponDiscount(selectedCoupon, goods) : 0;
  const total = Math.max(0, goods + shipping - discount);

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addressList.find((a) => a.isDefault)?.id ?? addressList[0]?.id ?? "",
  );
  const [method, setMethod] = useState<Method>("zfb");
  const [remark, setRemark] = useState("");
  const [showForm, setShowForm] = useState(addressList.length === 0);
  const [form, setForm] = useState<AddressFormState>(emptyForm);

  const selectedAddress: Address | undefined = addressList.find(
    (a) => a.id === selectedAddressId,
  );

  if (checkedItems.length === 0) {
    return (
      <AppLayout>
        <PageTransition>
          <div className="container py-20">
            <EmptyState
              title="没有选中要结算的商品"
              desc="先去购物车挑几件再说"
              action={
                <Link to="/cart" className="btn-base bg-ink text-cream">
                  回到购物车
                </Link>
              }
            />
          </div>
        </PageTransition>
      </AppLayout>
    );
  }

  function saveAddress() {
    if (!form.name || !form.phone || !form.region || !form.detail) return;
    const addr = addAddress({
      name: form.name,
      phone: form.phone,
      region: form.region,
      detail: form.detail,
      isDefault: form.isDefault,
    });
    setSelectedAddressId(addr.id);
    setForm(emptyForm);
    setShowForm(false);
  }

  function submitOrder() {
    if (!selectedAddress) return;
    const order = createOrder({
      items: checkedItems,
      address: selectedAddress,
      amount: { goods, shipping, discount, total },
      remark: remark.trim() || undefined,
    });
    if (selectedCoupon) consumeCoupon(selectedCoupon.id);
    removeItems(checkedItems.map((it) => it.id));
    navigate(`/payment/${order.id}?method=${method}`);
  }

  return (
    <AppLayout>
      <PageTransition>
        <div className="container py-10 lg:py-14">
          <div className="text-mono text-xs tracking-widest text-vermilion">CHECKOUT</div>
          <h1 className="text-display text-4xl lg:text-6xl mt-1">订单结算。</h1>

          <div className="mt-8 grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8 space-y-8">
              {/* 01 ADDRESS */}
              <section className="hairline bg-cream">
                <header className="flex items-center justify-between px-5 py-3 border-b border-ink">
                  <h2 className="font-serif text-lg flex items-center gap-2">
                    <span className="text-mono text-vermilion text-sm">01</span>
                    收货地址
                  </h2>
                  <button
                    onClick={() => setShowForm((v) => !v)}
                    className="text-xs flex items-center gap-1 hover:text-vermilion"
                  >
                    <Plus size={14} />
                    新增
                  </button>
                </header>
                <div className="p-5 space-y-3">
                  {addressList.map((a) => (
                    <label
                      key={a.id}
                      className={`flex items-start gap-3 p-3 border cursor-pointer transition-colors ${
                        a.id === selectedAddressId
                          ? "border-vermilion bg-vermilion/5"
                          : "border-ink/20 hover:border-ink"
                      }`}
                    >
                      <input
                        type="radio"
                        name="addr"
                        checked={a.id === selectedAddressId}
                        onChange={() => setSelectedAddressId(a.id)}
                        className="mt-1 accent-vermilion"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{a.name}</span>
                          <span className="text-mono text-ink/60">{a.phone}</span>
                          {a.isDefault && (
                            <span className="text-[10px] px-1.5 py-0.5 bg-mustard text-ink">默认</span>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-ink/70">
                          {a.region}・{a.detail}
                        </div>
                      </div>
                      <Pencil size={14} className="text-ink/40" />
                    </label>
                  ))}

                  {showForm && (
                    <div className="p-4 border border-dashed border-ink/40 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          placeholder="收件人"
                          value={form.name}
                          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                          className="border border-ink px-3 py-2 text-sm bg-cream"
                        />
                        <input
                          placeholder="手机号"
                          value={form.phone}
                          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                          className="border border-ink px-3 py-2 text-sm bg-cream text-mono"
                        />
                      </div>
                      <input
                        placeholder="省/市/区"
                        value={form.region}
                        onChange={(e) => setForm((p) => ({ ...p, region: e.target.value }))}
                        className="w-full border border-ink px-3 py-2 text-sm bg-cream"
                      />
                      <input
                        placeholder="详细地址"
                        value={form.detail}
                        onChange={(e) => setForm((p) => ({ ...p, detail: e.target.value }))}
                        className="w-full border border-ink px-3 py-2 text-sm bg-cream"
                      />
                      <label className="flex items-center gap-2 text-xs text-ink/70">
                        <input
                          type="checkbox"
                          checked={form.isDefault}
                          onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))}
                          className="accent-vermilion"
                        />
                        设为默认地址
                      </label>
                      <div className="flex gap-2">
                        <Button onClick={saveAddress} size="sm">保存</Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setShowForm(false);
                            setForm(emptyForm);
                          }}
                        >
                          取消
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* 02 ITEMS */}
              <section className="hairline bg-cream">
                <header className="flex items-center justify-between px-5 py-3 border-b border-ink">
                  <h2 className="font-serif text-lg flex items-center gap-2">
                    <span className="text-mono text-vermilion text-sm">02</span>
                    确认商品
                  </h2>
                  <span className="text-xs text-ink/60">共 {checkedItems.length} 件</span>
                </header>
                <ul>
                  {checkedItems.map((it) => (
                    <li
                      key={it.id}
                      className="flex items-center gap-4 px-5 py-4 border-b border-ink/10 last:border-b-0"
                    >
                      <div className="w-16 h-16 border border-ink bg-paper overflow-hidden">
                        <img src={it.snapshot.cover} alt={it.snapshot.title} className="w-full h-full object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-serif text-sm line-clamp-1">{it.snapshot.title}</div>
                        <div className="text-xs text-ink/55 mt-0.5">
                          {Object.keys(it.spec).length > 0
                            ? `${Object.entries(it.spec).map(([k, v]) => `${k}: ${v}`).join(" / ")} · x${it.quantity}`
                            : `x${it.quantity}`}
                        </div>
                      </div>
                      <div className="text-mono text-vermilion text-sm">
                        {formatPrice(it.snapshot.price * it.quantity)}
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="px-5 py-3 border-t border-ink/20 flex items-center">
                  <input
                    placeholder="订单备注（可选）"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    className="flex-1 px-3 py-2 text-sm bg-cream border border-ink/20 focus:border-ink outline-none"
                  />
                </div>
              </section>

              {/* 03 PAYMENT */}
              <section className="hairline bg-cream">
                <header className="px-5 py-3 border-b border-ink">
                  <h2 className="font-serif text-lg flex items-center gap-2">
                    <span className="text-mono text-vermilion text-sm">03</span>
                    支付方式
                  </h2>
                </header>
                <div className="p-5 grid sm:grid-cols-3 gap-3">
                  {methods.map((m) => {
                    const active = method === m.key;
                    return (
                      <button
                        key={m.key}
                        onClick={() => setMethod(m.key)}
                        className={`text-left p-3 border transition-colors ${
                          active
                            ? "border-vermilion bg-vermilion/5"
                            : "border-ink/20 hover:border-ink"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 grid place-items-center text-mono text-sm ${
                              active ? "bg-vermilion text-cream" : "bg-paper text-ink/70"
                            }`}
                          >
                            {m.mark}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{m.label}</div>
                            <div className="text-xs text-ink/55">{m.desc}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* SUMMARY */}
            <aside className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 self-start">
              <div className="hairline bg-paper p-5">
                <div className="text-mono text-xs tracking-widest text-ink/60">SUMMARY</div>
                <h3 className="font-serif text-2xl mt-1">订单合计</h3>

                {/* COUPON PICKER */}
                <div className="mt-4 pt-3 border-t border-ink/20">
                  <div className="flex items-center gap-2 text-xs text-ink/60 mb-2">
                    <Ticket size={14} />
                    优惠券
                    {availableCoupons.length === 0 && (
                      <Link to="/deals#coupons" className="ml-auto underline underline-offset-2 text-vermilion">
                        去领券
                      </Link>
                    )}
                  </div>
                  {availableCoupons.length > 0 ? (
                    <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      <label className="flex items-center gap-2 text-xs cursor-pointer">
                        <input
                          type="radio"
                          name="coupon"
                          checked={selectedCouponId === ""}
                          onChange={() => setSelectedCouponId("")}
                          className="accent-vermilion"
                        />
                        <span>不使用优惠券</span>
                      </label>
                      {availableCoupons.map((c) => {
                        const discountAmount = calcCouponDiscount(c, goods);
                        const usable = c.kind === "shipping" || discountAmount > 0;
                        return (
                          <label
                            key={c.id}
                            className={`flex items-center gap-2 text-xs cursor-pointer ${
                              usable ? "" : "opacity-50"
                            }`}
                          >
                            <input
                              type="radio"
                              name="coupon"
                              checked={selectedCouponId === c.id}
                              onChange={() => setSelectedCouponId(c.id)}
                              disabled={!usable}
                              className="accent-vermilion"
                            />
                            <span className="flex-1 truncate">
                              {describeCoupon(c)} · {c.scope}
                            </span>
                            {usable && c.kind !== "shipping" && (
                              <span className="text-mono text-vermilion">
                                - ¥{discountAmount.toFixed(2)}
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-ink/45">暂无可用优惠券</div>
                  )}
                </div>

                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink/60">商品</dt>
                    <dd className="text-mono">{formatPrice(goods)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink/60">运费</dt>
                    <dd className="text-mono text-moss">
                      {selectedCoupon?.kind === "shipping" ? "包邮券抵扣" : "免邮"}
                    </dd>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <dt className="text-ink/60">优惠券抵扣</dt>
                      <dd className="text-mono text-vermilion">- {formatPrice(discount)}</dd>
                    </div>
                  )}
                </dl>
                <div className="mt-4 pt-4 border-t border-ink/30 flex items-end justify-between">
                  <div className="text-sm text-ink/60">应付金额</div>
                  <div className="text-mono text-3xl text-vermilion">
                    {formatPrice(total)}
                  </div>
                </div>
                <Button
                  block
                  size="lg"
                  className="mt-5"
                  onClick={submitOrder}
                  disabled={!selectedAddress}
                >
                  提交订单 / 前往支付
                </Button>
                <p className="mt-3 text-xs text-ink/45 leading-relaxed">
                  本站为演示用途，提交订单后将进入模拟支付页面，
                  <br />
                  不会从任何账户实际扣款。
                </p>
              </div>
            </aside>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
