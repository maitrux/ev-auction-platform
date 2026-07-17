import { Skeleton } from "@/components/skeleton";
import { TableSkeleton } from "@/components/table-skeleton";

export default function Loading() {
  return (
    <main className="p-6">
      <Skeleton className="mb-6 h-8 w-32" />
      <TableSkeleton columns={6} />
    </main>
  );
}
