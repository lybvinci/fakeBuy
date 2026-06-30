import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import PageTransition from "@/components/layout/PageTransition";
import { categoryDefs } from "@/data/categories";

export default function Categories() {
  // 按 group 分组
  const groups = categoryDefs.reduce<Record<string, typeof categoryDefs>>((acc, c) => {
    acc[c.group] = acc[c.group] || [];
    acc[c.group].push(c);
    return acc;
  }, {});

  return (
    <AppLayout>
      <PageTransition>
        <section className="container pt-10 lg:pt-14 pb-20">
          <div className="text-mono text-xs tracking-widest text-vermilion">CATEGORIES</div>
          <h1 className="text-display text-5xl lg:text-7xl mt-1">全部分类</h1>
          <p className="mt-2 text-sm text-ink/55">浏览所有分类，找到你想要的</p>

          <div className="mt-10 space-y-10">
            {Object.entries(groups).map(([group, items]) => (
              <section key={group}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-display text-2xl">{group}</h2>
                  <div className="flex-1 h-px bg-ink/20" />
                  <span className="text-mono text-xs text-ink/45">{items.length} 个</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {items.map((c) => (
                    <Link
                      key={c.slug}
                      to={`/category/${c.slug}`}
                      className="hairline bg-cream p-4 hover:shadow-paper hover:-translate-y-0.5 transition-all"
                    >
                      <div className="font-serif text-base">{c.name}</div>
                      <div className="mt-1 text-xs text-ink/55 line-clamp-1">{c.slogan}</div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </PageTransition>
    </AppLayout>
  );
}
