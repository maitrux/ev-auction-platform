import {
  formatAuctionStatus,
  formatCurrency,
  formatDate,
} from "@/lib/format";
import type { AuctionListItem } from "@/types";
import Link from "next/link";

interface AuctionsTableProps {
  auctions: AuctionListItem[];
}

export function AuctionsTable({ auctions }: AuctionsTableProps) {
  if (auctions.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-gray-600">
        No auctions yet. Create your first auction to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-gray-50">
          <tr>
            <th className="px-4 py-3">Vehicle</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Start</th>
            <th className="px-4 py-3">End</th>
            <th className="px-4 py-3">Bids</th>
            <th className="px-4 py-3">Highest bid</th>
          </tr>
        </thead>

        <tbody>
          {auctions.map((auction) => {
            const status = formatAuctionStatus(auction.status);

            return (
              <tr
                key={auction.id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/auctions/${auction.id}`}
                    className="font-medium text-blue-600 hover:text-blue-800"
                  >
                    {auction.vehicle.make} {auction.vehicle.model}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.badgeClassName}`}
                  >
                    {status.label}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {auction.startsAt ? formatDate(auction.startsAt) : "-"}
                </td>
                <td className="px-4 py-3">
                  {auction.endsAt ? formatDate(auction.endsAt) : "-"}
                </td>
                <td className="px-4 py-3">{auction.bidCount}</td>
                <td className="px-4 py-3">
                  {auction.highestBid != null
                    ? formatCurrency(auction.highestBid)
                    : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
