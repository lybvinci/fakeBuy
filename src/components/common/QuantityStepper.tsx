import { Minus, Plus } from "lucide-react";

interface Props {
  value: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
}

export default function QuantityStepper({ value, min = 1, max = 99, onChange, size = "md" }: Props) {
  const dim = size === "sm" ? "h-7 w-7 text-sm" : "h-9 w-9 text-base";
  const num = size === "sm" ? "w-10 text-xs" : "w-12 text-sm";
  return (
    <div className="inline-flex items-stretch border border-ink select-none">
      <button
        type="button"
        aria-label="减少"
        className={`${dim} grid place-items-center hover:bg-ink hover:text-cream disabled:opacity-30`}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Minus size={14} />
      </button>
      <div className={`${num} grid place-items-center border-x border-ink text-mono`}>{value}</div>
      <button
        type="button"
        aria-label="增加"
        className={`${dim} grid place-items-center hover:bg-ink hover:text-cream disabled:opacity-30`}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
