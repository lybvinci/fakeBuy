import { splitPrice } from "@/utils/format";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  original?: number;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  className?: string;
  color?: "vermilion" | "ink";
}

const sizeMap = {
  sm: { int: "text-lg", dec: "text-xs" },
  md: { int: "text-2xl", dec: "text-sm" },
  lg: { int: "text-4xl", dec: "text-base" },
  xl: { int: "text-5xl", dec: "text-lg" },
  hero: { int: "text-6xl", dec: "text-xl" },
};

export default function PriceTag({
  value,
  original,
  size = "md",
  className,
  color = "vermilion",
}: Props) {
  const { int, dec } = splitPrice(value);
  const cls = sizeMap[size];
  const colorCls = color === "vermilion" ? "text-vermilion" : "text-ink";
  return (
    <div className={cn("inline-flex items-baseline gap-1", className)}>
      <span className={cn("text-mono align-baseline", colorCls, cls.int === "text-lg" ? "text-sm" : "text-sm")}>¥</span>
      <span className={cn("text-display leading-none", colorCls, cls.int)}>{int}</span>
      <span className={cn("text-mono", colorCls, cls.dec)}>.{dec}</span>
      {original !== undefined && original > value && (
        <span className="text-mono text-xs text-ink/40 line-through ml-2">¥{original.toFixed(2)}</span>
      )}
    </div>
  );
}
