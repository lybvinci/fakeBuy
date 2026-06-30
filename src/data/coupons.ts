// 优惠券定义与活动数据

export type CouponKind = "threshold" | "discount" | "shipping";

export interface CouponTemplate {
  id: string;
  kind: CouponKind;
  name: string;
  /** 满 X 元 */
  threshold: number;
  /** 减 Y 元；折扣券为折扣 0-1 之间数字（如 0.9 表示 9 折） */
  value: number;
  /** 适用范围说明 */
  scope: string;
  /** 总量 */
  total: number;
  /** 已领取数量（mock） */
  claimed: number;
  /** 截止时间 (timestamp) */
  expireAt: number;
}

const DAY = 24 * 60 * 60 * 1000;

export const couponTemplates: CouponTemplate[] = [
  {
    id: "cp_30_200",
    kind: "threshold",
    name: "全场满减券",
    threshold: 200,
    value: 30,
    scope: "全场通用",
    total: 100000,
    claimed: 87234,
    expireAt: Date.now() + 7 * DAY,
  },
  {
    id: "cp_80_500",
    kind: "threshold",
    name: "大额满减券",
    threshold: 500,
    value: 80,
    scope: "全场通用",
    total: 50000,
    claimed: 31876,
    expireAt: Date.now() + 7 * DAY,
  },
  {
    id: "cp_200_1500",
    kind: "threshold",
    name: "尊享立减券",
    threshold: 1500,
    value: 200,
    scope: "数码/家电品类",
    total: 20000,
    claimed: 12453,
    expireAt: Date.now() + 5 * DAY,
  },
  {
    id: "cp_500_3000",
    kind: "threshold",
    name: "超级满减券",
    threshold: 3000,
    value: 500,
    scope: "全场通用",
    total: 10000,
    claimed: 4321,
    expireAt: Date.now() + 3 * DAY,
  },
  {
    id: "cp_disc_90",
    kind: "discount",
    name: "9 折券",
    threshold: 100,
    value: 0.9,
    scope: "服饰美妆专享",
    total: 50000,
    claimed: 28765,
    expireAt: Date.now() + 5 * DAY,
  },
  {
    id: "cp_disc_85",
    kind: "discount",
    name: "8.5 折券",
    threshold: 300,
    value: 0.85,
    scope: "新人专享",
    total: 30000,
    claimed: 18432,
    expireAt: Date.now() + 5 * DAY,
  },
  {
    id: "cp_shipping",
    kind: "shipping",
    name: "包邮券",
    threshold: 0,
    value: 0,
    scope: "全场免运费",
    total: 200000,
    claimed: 156782,
    expireAt: Date.now() + 7 * DAY,
  },
];

export function findCoupon(id: string): CouponTemplate | undefined {
  return couponTemplates.find((c) => c.id === id);
}

/** 计算某个优惠券对当前金额的减免值（不可叠加，由调用方控制） */
export function calcCouponDiscount(coupon: CouponTemplate, amount: number): number {
  if (amount < coupon.threshold) return 0;
  if (coupon.kind === "threshold") return coupon.value;
  if (coupon.kind === "discount") return Math.round(amount * (1 - coupon.value) * 100) / 100;
  // 包邮券：在结算页结合运费抵扣，这里不直接抵扣商品金额
  return 0;
}

export function describeCoupon(coupon: CouponTemplate): string {
  if (coupon.kind === "threshold") {
    return coupon.threshold > 0 ? `满 ¥${coupon.threshold} 减 ¥${coupon.value}` : `立减 ¥${coupon.value}`;
  }
  if (coupon.kind === "discount") {
    return `满 ¥${coupon.threshold} 享 ${(coupon.value * 10).toFixed(1)} 折`;
  }
  return "全场包邮";
}
