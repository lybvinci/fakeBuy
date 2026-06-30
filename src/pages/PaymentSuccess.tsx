import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/AppLayout";
import PageTransition from "@/components/layout/PageTransition";
import Button from "@/components/common/Button";
import EmptyState from "@/components/common/EmptyState";
import { useOrderStore } from "@/stores/useOrderStore";
import { formatPrice, formatTime } from "@/utils/format";

export default function PaymentSuccess() {
  const { orderId = "" } = useParams();
  const navigate = useNavigate();
  const order = useOrderStore((s) => s.list.find((o) => o.id === orderId));

  useEffect(() => {
    if (!order) return;
    if (order.status === "pending_pay") {
      navigate(`/payment/${orderId}`, { replace: true });
    }
  }, [order, orderId, navigate]);

  if (!order) {
    return (
      <AppLayout>
        <div className="container py-20">
          <EmptyState
            title="未找到订单"
            action={<Button onClick={() => navigate("/orders")}>查看我的订单</Button>}
          />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageTransition>
        <div className="container py-16 lg:py-24">
          <div className="max-w-2xl mx-auto hairline bg-cream p-10 lg:p-14 text-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="mx-auto w-24 h-24 grid place-items-center border-2 border-moss rounded-full bg-cream"
            >
              <svg width="56" height="56" viewBox="0 0 64 64" fill="none">
                <motion.path
                  d="M14 33 L28 47 L52 19"
                  stroke="#1F3A2E"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.65, delay: 0.2, ease: "easeOut" }}
                />
              </svg>
            </motion.div>

            <div className="mt-6 text-mono text-xs text-vermilion tracking-widest">PAYMENT SUCCESS</div>
            <h1 className="text-display text-4xl lg:text-6xl mt-2">支付成功</h1>
            <p className="mt-3 font-serif text-base text-ink/65">
              感谢你的下单，订单已提交至商家。
              <br />
              即将为你安排发货，可在「我的订单」中追踪物流。
            </p>

            <div className="mt-8 text-left bg-paper border border-ink p-5">
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-ink/55">订单编号</dt>
                <dd className="text-mono text-right">{order.id}</dd>
                <dt className="text-ink/55">下单时间</dt>
                <dd className="text-mono text-right">{formatTime(order.createdAt)}</dd>
                <dt className="text-ink/55">实付金额</dt>
                <dd className="text-mono text-right text-vermilion text-base">
                  {formatPrice(order.amount.total)}
                </dd>
              </dl>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button variant="primary" onClick={() => navigate(`/orders/${order.id}`)}>
                查看订单 / 追踪物流
              </Button>
              <Link to="/" className="btn-base border border-ink hover:bg-ink hover:text-cream">
                继续购物
              </Link>
            </div>
          </div>
        </div>
      </PageTransition>
    </AppLayout>
  );
}
