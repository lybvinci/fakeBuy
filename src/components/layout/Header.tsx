import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, ScrollText, Menu, Flame } from "lucide-react";
import { useState } from "react";
import { useCartStore, selectCartCount } from "@/stores/useCartStore";
import { navCategories } from "@/data/categories";

export default function Header() {
  const navigate = useNavigate();
  const cartCount = useCartStore(selectCartCount);
  const [keyword, setKeyword] = useState("");
  const [drawer, setDrawer] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = keyword.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-ink/80 bg-cream/95 backdrop-blur">
      <div className="container flex items-center gap-4 py-4 lg:py-5">
        <Link to="/" className="flex items-baseline gap-2 mr-2 select-none">
          <span className="text-display text-3xl lg:text-4xl text-vermilion leading-none">
            fakeBuy
          </span>
          <span className="hidden sm:inline font-serif text-base text-ink/70 leading-none">
            假买 · 假装在买
          </span>
        </Link>

        <form
          onSubmit={onSubmit}
          className="hidden md:flex flex-1 max-w-xl items-center hairline bg-cream"
        >
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索商品 / 品牌 / 关键词"
            className="flex-1 bg-transparent px-4 py-2 text-sm placeholder:text-ink/40 outline-none"
            aria-label="搜索"
          />
          <button
            type="submit"
            className="flex items-center gap-1 bg-ink text-cream px-4 py-2 text-sm hover:bg-vermilion transition-colors"
          >
            <Search size={16} />
            搜索
          </button>
        </form>

        <div className="ml-auto flex items-center gap-2 lg:gap-3">
          <Link
            to="/deals"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-vermilion hover:text-vermilion-dark transition-colors"
          >
            <Flame size={18} />
            百亿补贴
          </Link>
          <Link
            to="/orders"
            className="hidden sm:inline-flex items-center gap-1 px-3 py-2 text-sm font-medium hover:text-vermilion transition-colors"
          >
            <ScrollText size={18} />
            我的订单
          </Link>
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-1 px-3 py-2 text-sm font-medium border border-ink bg-cream hover:bg-ink hover:text-cream transition-colors"
            id="header-cart"
          >
            <ShoppingBag size={18} />
            购物车
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 inline-flex items-center justify-center text-[11px] text-mono text-cream bg-vermilion rounded-full">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setDrawer((v) => !v)}
            className="md:hidden p-2 border border-ink"
            aria-label="导航"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      <nav className="hidden md:block border-t border-ink/20">
        <ul className="container flex items-center gap-1 py-2 overflow-x-auto scroll-hide text-sm">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                [
                  "px-3 py-1.5 transition-colors whitespace-nowrap",
                  isActive
                    ? "text-vermilion font-medium underline underline-offset-4 decoration-vermilion"
                    : "text-ink/70 hover:text-ink",
                ].join(" ")
              }
            >
              首页
            </NavLink>
          </li>
          {navCategories.map((n) => (
            <li key={n.slug}>
              <NavLink
                to={`/category/${n.slug}`}
                className={({ isActive }) =>
                  [
                    "px-3 py-1.5 transition-colors whitespace-nowrap",
                    isActive
                      ? "text-vermilion font-medium underline underline-offset-4 decoration-vermilion"
                      : "text-ink/70 hover:text-ink",
                  ].join(" ")
                }
              >
                {n.label}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                [
                  "px-3 py-1.5 transition-colors whitespace-nowrap",
                  isActive
                    ? "text-vermilion font-medium underline underline-offset-4 decoration-vermilion"
                    : "text-ink/70 hover:text-ink",
                ].join(" ")
              }
            >
              全部分类
            </NavLink>
          </li>
        </ul>
      </nav>

      {drawer && (
        <div className="md:hidden border-t border-ink/20 bg-cream">
          <form onSubmit={onSubmit} className="container py-3">
            <div className="flex items-center hairline bg-cream">
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="搜索"
                className="flex-1 bg-transparent px-4 py-2 text-sm outline-none"
              />
              <button type="submit" className="bg-ink text-cream px-4 py-2 text-sm">
                <Search size={16} />
              </button>
            </div>
          </form>
          <ul className="container grid grid-cols-3 gap-2 pb-4">
            <li>
              <NavLink
                to="/"
                end
                onClick={() => setDrawer(false)}
                className={({ isActive }) =>
                  [
                    "block text-center py-2 text-sm border",
                    isActive ? "border-vermilion text-vermilion" : "border-ink/30 text-ink/80",
                  ].join(" ")
                }
              >
                首页
              </NavLink>
            </li>
            {navCategories.map((n) => (
              <li key={n.slug}>
                <NavLink
                  to={`/category/${n.slug}`}
                  onClick={() => setDrawer(false)}
                  className={({ isActive }) =>
                    [
                      "block text-center py-2 text-sm border",
                      isActive
                        ? "border-vermilion text-vermilion"
                        : "border-ink/30 text-ink/80",
                    ].join(" ")
                  }
                >
                  {n.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink
                to="/orders"
                onClick={() => setDrawer(false)}
                className="block text-center py-2 text-sm border border-ink/30"
              >
                我的订单
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
