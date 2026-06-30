# fakeBuy 假买 · 假装在买

一个看起来很真的购物站：完整浏览、加车、下单、模拟支付、物流追踪流程；商品数据来自 [DummyJSON](https://dummyjson.com) 公开接口并本地化为中文展示，所有支付均为模拟，不会从任何账户扣款。

在线 Demo：<https://lybvinci.github.io/fakeBuy/>

## 技术栈

- React 18 + TypeScript + Vite 6
- TailwindCSS + 自定义复古杂志主题
- Zustand（persist 到 localStorage）
- React Router 7、Framer Motion、Lucide Icons

## 本地开发

```bash
pnpm install
pnpm run dev            # 仅本机访问
pnpm run dev:host       # 局域网访问，自动暴露 0.0.0.0:5173
pnpm run check          # TypeScript 检查
pnpm run build          # 生产构建
pnpm run preview:host   # 预览生产构建，自动暴露 0.0.0.0:4173
```

## 部署到 GitHub Pages

仓库已包含 `.github/workflows/deploy.yml`：每次 push 到 `main` / `master` 会自动构建并发布到 GitHub Pages。

首次启用步骤：

1. 在 GitHub 创建仓库 `lybvinci/fakeBuy`
2. 本地：
   ```bash
   git init
   git remote add origin git@github.com:lybvinci/fakeBuy.git
   git add .
   git commit -m "init: fakeBuy"
   git branch -M main
   git push -u origin main
   ```
3. GitHub 仓库页 → **Settings → Pages → Build and deployment → Source = GitHub Actions**
4. Actions 运行成功后访问 <https://lybvinci.github.io/fakeBuy/>

> 本仓库已开启 SPA fallback：`public/404.html` 会把刷新时的子路由重新交给 React Router。

## 数据来源

- 商品/分类/评论：[DummyJSON Products](https://dummyjson.com/products)（图片、价格、SKU、库存、评分、原始评论日期为真实 API 数据）
- 中文标题、品牌、描述、评论文案、运费/保修/退货/库存状态通过 [`src/api/i18n.ts`](src/api/i18n.ts) 字典本地化
- 物流节点为本地生成（[`src/utils/logistics.ts`](src/utils/logistics.ts)）

## 主要功能

- 首页（轮播 Hero + 滚动公告 + 分类直达 + 编辑精选 + 猜你喜欢）
- 24 个真实分类、全部分类页（按数码 / 服饰 / 美妆 / 家居 / 美食 / 运动 / 户外分组）
- 商品详情：图集、参数、库存、运费/保修/退货政策、买家评价、相关推荐
- 搜索、购物车、地址簿、结算、模拟支付（支付宝 / 微信 / 银行卡 二维码）
- 我的订单 + 物流追踪（节点随时间递增）
- 拼多多风格的 `/deals` 活动页：百亿补贴 Hero、限时秒杀（倒计时）、领券中心（满减 / 折扣 / 包邮券）、特惠瀑布流
- 结算时选择已领取优惠券，自动按门槛 / 折扣计算抵扣

## 免责声明

本站为前端 Demo，所有商品仅用于演示、不会真实发货；所有支付均为模拟、不会从任何账户扣款；用户数据仅保存于浏览器 localStorage。
