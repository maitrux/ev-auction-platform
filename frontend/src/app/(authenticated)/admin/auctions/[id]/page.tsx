import { getAuction } from "@/lib/server/auctions";
import { notFound } from "next/navigation";
import { AuctionDetailView } from "./auction-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function AuctionDetailPage({ params }: PageProps) {
  const { id } = await params;

  try {
    const auction = await getAuction(id);

    return (
      <main className="p-6">
        <AuctionDetailView auction={auction} />
      </main>
    );
  } catch {
    notFound();
  }
}
