interface Props {
  count?: number;
  columns?: 2 | 3 | 4 | 5;
}

const columnsCls = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
};

export default function ProductSkeleton({ count = 8, columns = 4 }: Props) {
  return (
    <div className={`grid gap-4 lg:gap-6 ${columnsCls[columns]}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="hairline bg-cream">
          <div className="aspect-square bg-paper animate-pulse" />
          <div className="p-3 border-t border-ink space-y-2">
            <div className="h-4 bg-paper animate-pulse" />
            <div className="h-3 w-2/3 bg-paper animate-pulse" />
            <div className="mt-2 flex items-center justify-between">
              <div className="h-5 w-20 bg-paper animate-pulse" />
              <div className="h-3 w-12 bg-paper animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
