export interface Category {
  id: string;
  name: string;
  slogan: string;
  cover: string;
}

export interface ProductSpec {
  name: string;
  options: string[];
}

export interface Shop {
  id: string;
  name: string;
  rating: number;
}

export interface Product {
  id: string;
  title: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  cover: string;
  categoryId: string;
  brand: string;
  sales: number;
  rating: number;
  specs: ProductSpec[];
  shop: Shop;
  description: string[];
  tags: string[];
}

export interface CartItem {
  id: string;
  productId: string;
  spec: Record<string, string>;
  quantity: number;
  selected: boolean;
  snapshot: {
    title: string;
    cover: string;
    price: number;
  };
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  region: string;
  detail: string;
  isDefault: boolean;
}

export type PaymentMethod = "zfb" | "wx" | "bank";
export type OrderStatus = "pending_pay" | "paid" | "shipped";

export interface LogisticsNode {
  time: number;
  title: string;
  desc?: string;
}

export interface OrderAmount {
  goods: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  items: CartItem[];
  address: Address;
  paymentMethod?: PaymentMethod;
  amount: OrderAmount;
  createdAt: number;
  paidAt?: number;
  logistics: LogisticsNode[];
  remark?: string;
}

export interface Review {
  id: string;
  productId: string;
  user: { nickname: string; avatar: string };
  rating: number;
  content: string;
  spec?: string;
  createdAt: number;
}
