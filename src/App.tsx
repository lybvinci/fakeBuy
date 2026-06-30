import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Category from "@/pages/Category";
import Categories from "@/pages/Categories";
import Deals from "@/pages/Deals";
import Search from "@/pages/Search";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Checkout from "@/pages/Checkout";
import Payment from "@/pages/Payment";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import NotFound from "@/pages/NotFound";

// 部署到 GitHub Pages 子路径时（/fakeBuy/）使用对应 basename；本地开发为 /。
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function App() {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/deals" element={<Deals />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/category/:id" element={<Category />} />
        <Route path="/search" element={<Search />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment/:orderId" element={<Payment />} />
        <Route path="/payment-success/:orderId" element={<PaymentSuccess />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
