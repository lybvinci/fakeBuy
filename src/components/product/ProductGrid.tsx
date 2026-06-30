import type { Product } from "@/types";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
  columns?: 2 | 3 | 4 | 5;
}

const columnsCls = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
};

export default function ProductGrid({ products, columns = 4 }: Props) {
  return (
    <div className={`grid gap-4 lg:gap-6 ${columnsCls[columns]}`}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
