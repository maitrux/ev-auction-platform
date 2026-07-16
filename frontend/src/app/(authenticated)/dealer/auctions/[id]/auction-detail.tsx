"use client";

import { AuctionCountdown } from "@/components/auction-countdown";
import {
  hasBidFormErrors,
  validateBidForm,
  type BidFormErrors,
} from "@/lib/bid-form-validation";
import {
  formatAuctionStatus,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
} from "@/lib/format";
import { placeBidAction } from "@/lib/server/bid-actions";
import type { DealerAuctionDetail } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DealerAuctionDetailViewProps {
  auction: DealerAuctionDetail;
  backHref: string;
  backLabel: string;
}

function fieldClassName(hasError: boolean) {
  return hasError
    ? "w-full rounded border border-red-500 px-3 py-2 focus:border-red-500 focus:outline-none"
    : "w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none";
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p
      id={id}
      className="mt-1 text-sm text-red-600"
    >
      {message}
    </p>
  );
}

function VehiclePhotos({ photos, title }: { photos: string[]; title: string }) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {photos.map((photo, index) => (
        <div
          key={photo}
          className="relative aspect-[16/10] overflow-hidden rounded-lg bg-gray-100"
        >
          <Image
            src={photo}
            alt={`${title} photo ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  );
}

export function DealerAuctionDetailView({
  auction,
  backHref,
  backLabel,
}: DealerAuctionDetailViewProps) {
  const router = useRouter();
  const [amount, setAmount] = useState(
    auction.minNextBid != null ? String(auction.minNextBid) : "",
  );
  const [fieldErrors, setFieldErrors] = useState<BidFormErrors>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (auction.minNextBid != null) {
      setAmount(String(auction.minNextBid));
    }
  }, [auction.minNextBid, auction.myBid?.amount]);

  const status = formatAuctionStatus(auction.status);
  const title = `${auction.vehicle.year} ${auction.vehicle.make} ${auction.vehicle.model}`;
  const canBid = auction.status === "LIVE" && auction.minNextBid != null;

  function handleAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAmount(event.target.value);
    setFieldErrors({});
    setError("");
    setSuccess("");
  }

  async function handlePlaceBid() {
    setError("");
    setSuccess("");

    const validationErrors = validateBidForm(amount, auction.minNextBid);

    if (hasBidFormErrors(validationErrors)) {
      setFieldErrors(validationErrors);
      setError("Please fix the highlighted fields.");
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    const result = await placeBidAction(auction.id, Number(amount));

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setSuccess(`Your bid of ${formatCurrency(result.bid.amount)} was placed successfully.`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link
          href={backHref}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          {backLabel}
        </Link>
      </div>

      <div className="mb-8">
        <p className="text-sm text-gray-500">Auction #{auction.id.slice(0, 8)}</p>
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.badgeClassName}`}
          >
            {status.label}
          </span>
          <AuctionCountdown
            status={auction.status}
            startsAt={auction.startsAt}
            endsAt={auction.endsAt}
            onExpire={() => router.refresh()}
          />
        </div>
      </div>

      <VehiclePhotos
        photos={auction.vehicle.photos}
        title={title}
      />

      <section className="mb-8 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Vehicle details</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">VIN</dt>
            <dd className="font-medium">{auction.vehicle.vin}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Year</dt>
            <dd className="font-medium">{auction.vehicle.year}</dd>
          </div>
          <div>
            <dt className="text-gray-500">Mileage</dt>
            <dd className="font-medium">
              {formatNumber(auction.vehicle.mileage)} km
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Battery capacity</dt>
            <dd className="font-medium">
              {auction.vehicle.batteryCapacityKwh} kWh
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Battery SoH</dt>
            <dd className="font-medium">{auction.vehicle.batterySoH}%</dd>
          </div>
          <div>
            <dt className="text-gray-500">Range</dt>
            <dd className="font-medium">
              {formatNumber(auction.vehicle.rangeKm)} km
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Registration date</dt>
            <dd className="font-medium">
              {formatDate(auction.vehicle.registrationDate)}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Location</dt>
            <dd className="font-medium">
              {auction.vehicle.city}, {auction.vehicle.country}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Condition</dt>
            <dd className="font-medium">{auction.vehicle.condition}</dd>
          </div>
          {auction.vehicle.conditionNotes ? (
            <div className="col-span-2">
              <dt className="text-gray-500">Condition notes</dt>
              <dd className="font-medium">{auction.vehicle.conditionNotes}</dd>
            </div>
          ) : null}
        </dl>
      </section>

      <section className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Your bid</h2>

        {auction.myBid ? (
          <div className="mb-4 rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-gray-600">Your current bid</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(auction.myBid.amount)}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Placed {formatDateTime(auction.myBid.createdAt)}
            </p>
          </div>
        ) : (
          <p className="mb-4 text-sm text-gray-600">
            You haven&apos;t placed a bid on this auction yet.
          </p>
        )}

        {error ? (
          <div
            className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {success ? (
          <div
            className="mb-4 rounded bg-green-100 p-3 text-sm text-green-700"
            role="status"
          >
            {success}
          </div>
        ) : null}

        {canBid ? (
          <div>
            {auction.minNextBid != null ? (
              <p className="mb-3 text-sm text-gray-600">
                Minimum bid:{" "}
                <span className="font-medium text-gray-900">
                  {formatCurrency(auction.minNextBid)}
                </span>
              </p>
            ) : null}

            <div className="max-w-xs">
              <label
                htmlFor="bid-amount"
                className="mb-1 block text-sm font-medium"
              >
                Bid amount (€)
              </label>
              <input
                id="bid-amount"
                name="amount"
                type="number"
                value={amount}
                onChange={handleAmountChange}
                className={fieldClassName(Boolean(fieldErrors.amount))}
                aria-invalid={Boolean(fieldErrors.amount)}
                aria-describedby={fieldErrors.amount ? "bid-amount-error" : undefined}
                min={auction.minNextBid ?? undefined}
                step="1"
              />
              <FieldError
                id="bid-amount-error"
                message={fieldErrors.amount}
              />
            </div>

            <button
              type="button"
              onClick={handlePlaceBid}
              disabled={isSubmitting}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Place bid
            </button>
          </div>
        ) : auction.status === "SCHEDULED" ? (
          <p className="text-sm text-gray-600">
            Bidding opens when the auction goes live.
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            This auction is no longer accepting bids.
          </p>
        )}
      </section>
    </div>
  );
}
