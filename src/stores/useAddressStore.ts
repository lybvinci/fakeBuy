import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address } from "@/types";
import { newId } from "@/utils/id";

interface AddressState {
  list: Address[];
  add: (data: Omit<Address, "id">) => Address;
  update: (id: string, data: Partial<Address>) => void;
  remove: (id: string) => void;
  setDefault: (id: string) => void;
}

const seedAddress: Address = {
  id: "addr_seed",
  name: "张三",
  phone: "138 8888 8888",
  region: "浙江省 杭州市 余杭区",
  detail: "未来科技城 文一西路 1818 号",
  isDefault: true,
};

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      list: [seedAddress],
      add: (data) => {
        const addr: Address = { ...data, id: `addr_${newId()}` };
        let list = [...get().list, addr];
        if (addr.isDefault) {
          list = list.map((a) => ({ ...a, isDefault: a.id === addr.id }));
        }
        set({ list });
        return addr;
      },
      update: (id, data) => {
        let list = get().list.map((a) => (a.id === id ? { ...a, ...data } : a));
        if (data.isDefault) {
          list = list.map((a) => ({ ...a, isDefault: a.id === id }));
        }
        set({ list });
      },
      remove: (id) => {
        const list = get().list.filter((a) => a.id !== id);
        if (list.length > 0 && !list.some((a) => a.isDefault)) {
          list[0].isDefault = true;
        }
        set({ list });
      },
      setDefault: (id) => {
        set({
          list: get().list.map((a) => ({ ...a, isDefault: a.id === id })),
        });
      },
    }),
    { name: "fb_address" },
  ),
);

export function selectDefaultAddress(state: AddressState): Address | undefined {
  return state.list.find((a) => a.isDefault) ?? state.list[0];
}
