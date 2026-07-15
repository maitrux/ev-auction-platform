import Link from "next/link";

interface DealerAuctionDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DealerAuctionDetailPage({
  params,
}: DealerAuctionDetailPageProps) {
  const { id } = await params; // TODO: use later

  return (
    <main className="p-6">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/dealer/auctions"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to auctions
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
