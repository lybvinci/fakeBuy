import dayjs from "dayjs";

export function formatPrice(value: number, withSymbol = true): string {
  const fixed = value.toFixed(2);
  return withSymbol ? `¥${fixed}` : fixed;
}

export function splitPrice(value: number): { int: string; dec: string } {
  const [int, dec = "00"] = value.toFixed(2).split(".");
  return { int, dec };
}

export function formatTime(ts: number, pattern = "YYYY-MM-DD HH:mm:ss"): string {
  return dayjs(ts).format(pattern);
}

export function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  if (diff < minute) return "刚刚";
  if (diff < hour) return `${Math.floor(diff / minute)} 分钟前`;
  if (diff < day) return `${Math.floor(diff / hour)} 小时前`;
  if (diff < 30 * day) return `${Math.floor(diff / day)} 天前`;
  return dayjs(ts).format("YYYY-MM-DD");
}

export function shortNumber(n: number): string {
  if (n < 1000) return `${n}`;
  if (n < 10000) return `${(n / 1000).toFixed(1)}k`;
  return `${(n / 10000).toFixed(1)}w`;
}
