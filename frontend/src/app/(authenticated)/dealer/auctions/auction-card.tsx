import { AuctionCountdown } from "@/components/auction-countdown";
import {
  ImageUnavailableIcon,
  LoadingImage,
} from "@/components/loading-image";
import {
  DealerAuctionFrom,
  getDealerAuctionDetailHref,
} from "@/lib/dealer-auction-navigation";
import {
  formatAuctionStatus,
  formatCurrency,
  formatNumber,
} from "@/lib/format";
import type { DealerAuctionListItem } from "@/types/auction";
import Link from "next/link";

interface AuctionCardProps {
  auction: DealerAuctionListItem;
}

function VehicleImage({ photos, title }: { photos: string[]; title: string }) {
  const photo = photos[0];

  if (!photo) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
        <ImageUnavailableIcon />
      </div>
    );
  }

  return (
    <LoadingImage
      src={photo}
      alt={title}
      fill
      className="object-cover"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  );
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const status = formatAuctionStatus(auction.status);
  const title = `${auction.vehicle.year} ${auction.vehicle.make} ${auction.vehicle.model}`;
  return (
    <Link
      href={getDealerAuctionDetailHref(auction.id, DealerAuctionFrom.AUCTIONS)}
      className="group flex h-full flex-col overflow-hidden rounded-lg border bg-white transition hover:border-blue-300 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <VehicleImage
          photos={auction.vehicle.photos}
          title={title}
        />
        <span
          className={`absolute right-3 top-3 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.badgeClassName}`}
        >
          {status.label}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
              {title}
            </h2>
            <span className="text-sm text-gray-600">
              #{auction.id.slice(0, 8)}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            {auction.vehicle.city}, {auction.vehicle.country}
          </p>
          <p className="text-sm text-gray-600">
            {formatNumber(auction.vehicle.mileage)} km
          </p>
        </div>

        <div className="mt-auto space-y-3">
          <div className="min-h-14">
            {auction.myBid != null ? (
              <div className="rounded-lg bg-gray-100 px-3 py-2">
                <p className="text-xs text-gray-600">My bid</p>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(auction.myBid)}
                </p>
              </div>
            ) : null}
          </div>

          <AuctionCountdown
            status={auction.status}
            startsAt={auction.startsAt}
            endsAt={auction.endsAt}
          />
        </div>
      </div>
    </Link>
  );
}
