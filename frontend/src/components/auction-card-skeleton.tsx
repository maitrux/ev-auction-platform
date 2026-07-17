import { Skeleton } from "@/components/skeleton";

export function AuctionCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-white">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="mt-auto space-y-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  );
}
