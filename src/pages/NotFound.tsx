import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import PageTransition from "@/components/layout/PageTransition";

export default function NotFound() {
  return (
    <AppLayout>
      <PageTransition>
        <div className="container py-24 text-center">
          <div className="text-mono text-xs tracking-widest text-vermilion">404 / NOT FOUND</div>
          <h1 className="text-display text-[80px] lg:text-[160px] leading-none mt-2 text-vermilion">404</h1>
          <p className="mt-4 font-serif text-lg text-ink/70">
            这个页面比包裹丢得还快。
          </p>
          <Link
            to="/"
            className="inline-block mt-6 btn-base bg-ink text-cream border border-ink hover:bg-vermilion hover:border-vermilion"
          >
            回到首页
          </Link>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
