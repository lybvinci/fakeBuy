import { Star } from "lucide-react";

interface Props {
  value: number;
  size?: number;
  showText?: boolean;
}

export default function Stars({ value, size = 14, showText = false }: Props) {
  const rounded = Math.round(value * 2) / 2;
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      {[1, 2, 3, 4, 5].map((i) => {
        const active = i <= Math.floor(rounded);
        const half = !active && i - 0.5 === rounded;
        return (
          <Star
            key={i}
            size={size}
            className={
              active
                ? "text-mustard fill-mustard"
                : half
                  ? "text-mustard"
                  : "text-ink/20"
            }
          />
        );
      })}
      {showText && <span className="text-mono text-xs text-ink/60">{value.toFixed(1)}</span>}
    </span>
  );
}
