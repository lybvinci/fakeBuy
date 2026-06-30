import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  block?: boolean;
  children: ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-vermilion text-cream border border-vermilion hover:bg-vermilion-dark",
  secondary:
    "bg-moss text-cream border border-moss hover:bg-ink",
  outline:
    "bg-cream text-ink border border-ink hover:bg-ink hover:text-cream",
  ghost:
    "bg-transparent text-ink hover:bg-ink/5",
  danger:
    "bg-ink text-cream border border-ink hover:bg-vermilion",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  block = false,
  className,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        "btn-base",
        variantClasses[variant],
        sizeClasses[size],
        block && "w-full",
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="inline-block w-3 h-3 border-2 border-current border-r-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
}
