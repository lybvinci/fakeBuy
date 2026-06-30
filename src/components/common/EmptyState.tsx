import type { ReactNode } from "react";
import { PackageOpen } from "lucide-react";

interface Props {
  title?: string;
  desc?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export default function EmptyState({
  title = "这里空空如也",
  desc = "去逛逛吧，反正不要钱",
  action,
  icon,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 grid place-items-center bg-paper border border-ink mb-5 text-ink/70">
        {icon ?? <PackageOpen size={28} />}
      </div>
      <div className="font-serif text-xl text-ink">{title}</div>
      <div className="mt-1.5 text-sm text-ink/60 max-w-xs">{desc}</div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
