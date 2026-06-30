import type { ApiProduct } from "@/api/dummy";
import type { Product } from "@/types";
import {
  localizeBrand,
  localizeDescription,
  localizeTag,
  localizeTitle,
} from "@/api/i18n";

const USD_TO_CNY = 7.2;

export function toCNY(usd: number): number {
  return Math.round(usd * USD_TO_CNY * 100) / 100;
}

export function adaptProduct(p: ApiProduct): Product {
  const price = toCNY(p.price);
  const originalPrice =
    p.discountPercentage > 0
      ? Math.round((price / (1 - p.discountPercentage / 100)) * 100) / 100
      : undefined;

  const images = p.images.length > 0 ? p.images : [p.thumbnail];
  const sales = Math.max(0, 10000 - p.stock * 4) + Math.floor(p.rating * 800);

  const title = localizeTitle(p.title, p.category, p.sku);
  const brand = localizeBrand(p.brand);
  const description = localizeDescription(p.category, p.sku, p.description);
  const tags = p.tags.map(localizeTag);

  return {
    id: String(p.id),
    title,
    subtitle: description[0]?.slice(0, 40),
    price,
    originalPrice: originalPrice && originalPrice > price ? originalPrice : undefined,
    images,
    cover: p.thumbnail || images[0],
    categoryId: p.category,
    brand,
    sales,
    rating: Math.round(p.rating * 10) / 10,
    specs: [],
    shop: {
      id: `shop_${p.category}`,
      name: `${brand} 官方旗舰店`,
      rating: 4.8,
    },
    description,
    tags,
  };
}
