import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types";
import PriceTag from "./PriceTag";
import { shortNumber } from "@/utils/format";
import { useCartStore } from "@/stores/useCartStore";
import { flyToCart } from "@/utils/flyToCart";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);

  function quickAdd(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const spec = Object.fromEntries(
      product.specs.map((s) => [s.name, s.options[0]]),
    );
    addItem({ product, spec, quantity: 1 });
    const btn = e.currentTarget;
    const card = btn.closest("article");
    const img = card?.querySelector("img") as HTMLImageElement | null;
    if (img) flyToCart(img);
  }

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <article className="hairline bg-cream transition-all duration-200 hover:shadow-paper hover:-translate-y-1">
        <div className="relative aspect-square overflow-hidden bg-paper">
          <img
            src={product.cover}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {product.tags[0] && (
            <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[10px] tracking-widest bg-mustard text-ink uppercase">
              {product.tags[0]}
            </span>
          )}
          <button
            type="button"
            onClick={quickAdd}
            aria-label="加入购物车"
            className="absolute bottom-2 right-2 grid place-items-center w-9 h-9 bg-ink text-cream border border-ink translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all hover:bg-vermilion"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
        <div className="p-3 border-t border-ink">
          <h3 className="font-serif text-base leading-snug line-clamp-2 min-h-[3rem]">
            {product.title}
          </h3>
          {product.subtitle && (
            <p className="mt-1 text-xs text-ink/55 line-clamp-1">{product.subtitle}</p>
          )}
          <div className="mt-2.5 flex items-end justify-between">
            <PriceTag value={product.price} size="md" />
            <span className="text-mono text-xs text-ink/45">
              已售 {shortNumber(product.sales)}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
