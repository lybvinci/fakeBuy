export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink/30 bg-paper">
      <div className="container py-10 grid gap-8 md:grid-cols-3">
        <div>
          <div className="text-display text-2xl text-vermilion">fakeBuy</div>
          <p className="mt-2 text-sm text-ink/70 leading-relaxed font-serif">
            一家看起来很真的购物站。
            <br />
            浏览、下单、看物流，无需付款。
          </p>
        </div>
        <div className="text-sm space-y-1.5 text-ink/70">
          <div className="text-xs uppercase tracking-widest text-ink mb-2">免责声明</div>
          <div>本站所有商品仅用于演示，不会真实发货</div>
          <div>所有支付均为模拟，不会从任何账户扣款</div>
          <div>所有物流信息均为生成内容</div>
          <div>本站不对任何"剁手快感"承担责任</div>
        </div>
        <div className="text-sm space-y-1.5 text-ink/70">
          <div className="text-xs uppercase tracking-widest text-ink mb-2">数据来源</div>
          <div>商品数据来自 DummyJSON 公开接口</div>
          <div>用户数据保存于浏览器本地</div>
          <div className="text-mono text-xs pt-2">© {new Date().getFullYear()} fakeBuy</div>
        </div>
      </div>
    </footer>
  );
}
