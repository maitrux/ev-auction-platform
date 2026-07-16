import { Skeleton } from "@/components/skeleton";

export function AuctionDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl">
      <Skeleton className="mb-6 h-4 w-32" />
      <Skeleton className="mb-6 h-96 w-full rounded-lg" />
      <div className="mb-8 space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <section className="mb-8 rounded-lg border bg-white p-6">
        <Skeleton className="mb-4 h-6 w-36" />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="space-y-2"
            >
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>
      </section>
      <section className="rounded-lg border bg-white p-6">
        <Skeleton className="mb-4 h-6 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-3/4" />
      </section>
    </div>
  );
}
