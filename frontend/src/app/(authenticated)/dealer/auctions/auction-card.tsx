import { AuctionCountdown } from "@/components/auction-countdown";
import { formatAuctionStatus, formatNumber } from "@/lib/format";
import type { DealerAuctionListItem } from "@/types/auction";
import Image from "next/image";
import Link from "next/link";

interface AuctionCardProps {
  auction: DealerAuctionListItem;
}

function VehicleImage({ photos, title }: { photos: string[]; title: string }) {
  const photo = photos[0];

  if (photo) {
    return (
      <Image
        src={photo}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-12 w-12"
        aria-hidden="true"
      >
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <path d="M9 17h6" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    </div>
  );
}

export function AuctionCard({ auction }: AuctionCardProps) {
  const status = formatAuctionStatus(auction.status);
  const title = `${auction.vehicle.year} ${auction.vehicle.make} ${auction.vehicle.model}`;

  return (
    <Link
      href={`/dealer/auctions/${auction.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border bg-white transition hover:border-blue-300 hover:shadow-md"
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
          <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700">
            {title}
          </h2>
          <p className="text-sm text-gray-600">
            {auction.vehicle.city}, {auction.vehicle.country}
          </p>
          <p className="text-sm text-gray-600">
            {formatNumber(auction.vehicle.mileage)} km
          </p>
        </div>

        <AuctionCountdown
          status={auction.status}
          startsAt={auction.startsAt}
          endsAt={auction.endsAt}
        />
      </div>
    </Link>
  );
}
