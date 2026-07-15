import { getDealerAuctionBackLink } from "@/lib/dealer-auction-navigation";
import Link from "next/link";

interface DealerAuctionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    from?: string;
  }>;
}

export default async function DealerAuctionDetailPage({
  params,
  searchParams,
}: DealerAuctionDetailPageProps) {
  const { id } = await params; // TODO: use later
  const { from } = await searchParams;
  const back = getDealerAuctionBackLink(from);

  return (
    <main className="p-6">
      <div className="mx-auto max-w-2xl">
        <Link
          href={back.href}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {back.label}
        </Link>
        <div className="rounded-lg border bg-white p-8 text-center mt-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Auction detail to be implemented
          </h1>
          <p className="mt-3 text-gray-600">...</p>
        </div>
      </div>
    </main>
  );
}
