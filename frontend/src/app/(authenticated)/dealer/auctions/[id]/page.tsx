import { DealerAuctionDetailView } from "@/app/(authenticated)/dealer/auctions/[id]/auction-detail";
import { getDealerAuctionBackLink } from "@/lib/dealer-auction-navigation";
import { getDealerAuction } from "@/lib/server/dealer-auctions";
import { notFound } from "next/navigation";

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
  const { id } = await params;
  const { from } = await searchParams;
  const back = getDealerAuctionBackLink(from);

  let auction;

  try {
    auction = await getDealerAuction(id);
  } catch {
    notFound();
  }

  return (
    <main className="p-6">
      <DealerAuctionDetailView
        auction={auction}
        backHref={back.href}
        backLabel={back.label}
      />
    </main>
  );
}
