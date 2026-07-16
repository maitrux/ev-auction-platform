import { AuctionCardSkeleton } from "@/components/auction-card-skeleton";
import { Skeleton } from "@/components/skeleton";

export default function Loading() {
  return (
    <main className="p-6">
      <Skeleton className="mb-6 h-8 w-48" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <AuctionCardSkeleton key={index} />
        ))}
      </div>
    </main>
  );
}
