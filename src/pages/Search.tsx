import { Link, useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import PageTransition from "@/components/layout/PageTransition";
import ProductGrid from "@/components/product/ProductGrid";
import ProductSkeleton from "@/components/product/ProductSkeleton";
import EmptyState from "@/components/common/EmptyState";
import { useAsync } from "@/hooks/useAsync";
import { searchProducts } from "@/api/dummy";
import { adaptProduct } from "@/api/adapter";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = params.get("q") ?? "";

  const { data, loading, error } = useAsync(
    () =>
      q
        ? searchProducts(q, { limit: 60 }).then((r) => r.products.map(adaptProduct))
        : Promise.resolve([]),
    [q],
  );

  const results = data ?? [];

  return (
    <AppLayout>
      <PageTransition>
        <section className="container py-10 lg:py-14">
          <div className="text-mono text-xs tracking-widest text-vermilion">SEARCH</div>
          <h1 className="text-display text-4xl lg:text-6xl mt-1">"{q}"</h1>
          <div className="mt-2 text-sm text-ink/55">
            {loading ? "搜索中…" : `为你找到 ${results.length} 件相关商品`}
          </div>
        </section>
        <section className="container pb-20">
          {loading ? (
            <ProductSkeleton count={8} columns={4} />
          ) : error ? (
            <EmptyState
              title="搜索失败"
              desc="请稍后再试"
              icon={<Search size={28} />}
              action={
                <Link to="/" className="btn-base bg-ink text-cream">
                  回到首页
                </Link>
              }
            />
          ) : results.length > 0 ? (
            <ProductGrid products={results} columns={4} />
          ) : (
            <EmptyState
              title="没有找到相关商品"
              desc="换个关键词试试"
              icon={<Search size={28} />}
              action={
                <Link to="/" className="btn-base bg-ink text-cream">
                  回到首页
                </Link>
              }
            />
          )}
        </section>
      </PageTransition>
    </AppLayout>
  );
}
