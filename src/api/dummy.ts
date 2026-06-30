export interface ApiReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ApiProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight?: number;
  dimensions?: { width: number; height: number; depth: number };
  warrantyInformation?: string;
  shippingInformation?: string;
  availabilityStatus?: string;
  reviews?: ApiReview[];
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  images: string[];
  thumbnail: string;
  meta?: { createdAt: string; updatedAt: string; barcode?: string; qrCode?: string };
}

export interface ApiList {
  products: ApiProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface ApiCategory {
  slug: string;
  name: string;
  url: string;
}

const BASE = "https://dummyjson.com";

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return (await res.json()) as T;
}

export interface ListParams {
  limit?: number;
  skip?: number;
  sortBy?: "title" | "price" | "rating" | "stock";
  order?: "asc" | "desc";
}

function query(params: ListParams): string {
  const sp = new URLSearchParams();
  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.skip !== undefined) sp.set("skip", String(params.skip));
  if (params.sortBy) sp.set("sortBy", params.sortBy);
  if (params.order) sp.set("order", params.order);
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export function listProducts(params: ListParams = {}): Promise<ApiList> {
  return get<ApiList>(`/products${query(params)}`);
}

export function listProductsByCategory(slug: string, params: ListParams = {}): Promise<ApiList> {
  return get<ApiList>(`/products/category/${encodeURIComponent(slug)}${query(params)}`);
}

export function searchProducts(q: string, params: ListParams = {}): Promise<ApiList> {
  const sp = new URLSearchParams({ q });
  if (params.limit !== undefined) sp.set("limit", String(params.limit));
  if (params.skip !== undefined) sp.set("skip", String(params.skip));
  return get<ApiList>(`/products/search?${sp.toString()}`);
}

export function getProduct(id: number): Promise<ApiProduct> {
  return get<ApiProduct>(`/products/${id}`);
}

export function listCategories(): Promise<ApiCategory[]> {
  return get<ApiCategory[]>(`/products/categories`);
}
