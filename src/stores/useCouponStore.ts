import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CouponState {
  /** 已领取的优惠券模板 id */
  claimed: string[];
  /** 已使用的优惠券模板 id，避免重复使用 */
  used: string[];
  claim: (id: string) => void;
  consume: (id: string) => void;
  isClaimed: (id: string) => boolean;
  isUsed: (id: string) => boolean;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set, get) => ({
      claimed: [],
      used: [],
      claim: (id) => {
        if (get().claimed.includes(id)) return;
        set({ claimed: [...get().claimed, id] });
      },
      consume: (id) => {
        if (get().used.includes(id)) return;
        set({ used: [...get().used, id] });
      },
      isClaimed: (id) => get().claimed.includes(id),
      isUsed: (id) => get().used.includes(id),
    }),
    { name: "fb_coupons" },
  ),
);
