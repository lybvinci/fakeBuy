import type { LogisticsNode } from "@/types";

export const logisticsCopy: { title: string; desc?: string }[] = [
  { title: "包裹已离开 杭州转运中心", desc: "下一站：上海中转站" },
  { title: "包裹到达 上海中转站", desc: "已完成清点，等待发运" },
  { title: "包裹已离开 上海中转站", desc: "由航空运输前往目的城市" },
  { title: "干线运输中", desc: "您的包裹正在长途运输车辆上" },
  { title: "包裹到达 苏州转运中心", desc: "正在分拣处理" },
  { title: "包裹已离开 苏州转运中心", desc: "已发往下一站点" },
  { title: "包裹到达 南京中转站", desc: "正在装载，预计很快出发" },
  { title: "包裹已离开 南京中转站", desc: "由公路运输继续派送" },
  { title: "包裹到达 武汉转运中心", desc: "等待下一段干线运输" },
  { title: "包裹到达 西安中转站", desc: "已完成扫描入库" },
  { title: "包裹到达 成都转运中心", desc: "进入区域分拨中心" },
  { title: "包裹到达 广州转运中心", desc: "等待派送至目的网点" },
  { title: "包裹到达 北京转运中心", desc: "等待发往末端网点" },
  { title: "包裹到达目的城市分拨中心", desc: "正在分配至派送网点" },
  { title: "包裹到达派送网点", desc: "等待派送员揽件" },
  { title: "派送员已揽件", desc: "正在派送至您的收货地址" },
  { title: "派送员正在前往", desc: "请保持手机畅通" },
  { title: "包裹正在派送途中", desc: "请耐心等待" },
  { title: "由于交通原因短暂延误", desc: "正在恢复正常派送" },
  { title: "暂时未联系到收件人", desc: "派送员将于稍后再次派送" },
  { title: "派送计划已更新", desc: "新预计送达时间稍有延后" },
  { title: "包裹返回派送网点", desc: "明日将再次派送" },
  { title: "包裹再次出库", desc: "由派送员重新派送" },
  { title: "包裹完成 X-Ray 安检", desc: "继续运输流程" },
  { title: "天气原因航班延误", desc: "预计延迟数小时" },
  { title: "包裹转至次日航班", desc: "请耐心等待" },
];

export function nextLogisticsNode(existing: LogisticsNode[]): LogisticsNode {
  const usedTitles = new Set(existing.map((n) => n.title));
  const pool = logisticsCopy.filter((c) => !usedTitles.has(c.title));
  const source = pool.length > 0 ? pool : logisticsCopy;
  const pick = source[Math.floor(Math.random() * source.length)];
  return {
    time: Date.now(),
    title: pick.title,
    desc: pick.desc,
  };
}

export function initialLogistics(): LogisticsNode[] {
  return [
    {
      time: Date.now(),
      title: "您的订单已提交",
      desc: "正在等待商家发货",
    },
    {
      time: Date.now() + 1500,
      title: "商家已发货",
      desc: "包裹已交给承运方",
    },
  ];
}
