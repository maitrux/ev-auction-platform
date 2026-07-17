"use client";

import { AuctionCountdown } from "@/components/auction-countdown";
import { DealerAuctionOutcomeBadge } from "@/components/dealer-auction-outcome-badge";
import ImageCarousel from "@/components/image-carousel";
import { VehicleDetails } from "@/components/vehicle-details";
import {
  hasBidFormErrors,
  validateBidForm,
  type BidFormErrors,
} from "@/lib/bid-form-validation";
import {
  formatAuctionStatus,
  formatCurrency,
  formatDateTime,
} from "@/lib/format";
import { placeBidAction } from "@/lib/server/bid-actions";
import type { DealerAuctionDetail } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

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

function BidForm({
  auctionId,
  minNextBid,
  onBidAttempt,
  onBidPlaced,
}: {
  auctionId: string;
  minNextBid: number;
  onBidAttempt: () => void;
  onBidPlaced: (amount: number) => void;
}) {
  const [amount, setAmount] = useState(String(minNextBid));
  const [fieldErrors, setFieldErrors] = useState<BidFormErrors>({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleAmountChange(event: React.ChangeEvent<HTMLInputElement>) {
    setAmount(event.target.value);
    setFieldErrors({});
    setError("");
  }

  async function handlePlaceBid() {
    onBidAttempt();
    setError("");

    const validationErrors = validateBidForm(amount, minNextBid);

    if (hasBidFormErrors(validationErrors)) {
      setFieldErrors(validationErrors);
      setError("");
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);

    const result = await placeBidAction(auctionId, Number(amount));

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    onBidPlaced(result.bid.amount);
  }

  return (
    <div>
      <p className="mb-3 text-sm text-gray-600">
        Minimum bid:{" "}
        <span className="font-medium text-gray-900">
          {formatCurrency(minNextBid)}
        </span>
      </p>

      {error ? (
        <div
          className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
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
          min={minNextBid}
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
  );
}

export function DealerAuctionDetailView({
  auction,
  backHref,
  backLabel,
}: DealerAuctionDetailViewProps) {
  const router = useRouter();
  const [success, setSuccess] = useState("");

  const status = formatAuctionStatus(auction.status);
  const title = `${auction.vehicle.year} ${auction.vehicle.make} ${auction.vehicle.model}`;
  const canBid = auction.status === "LIVE" && auction.minNextBid != null;

  function handleBidAttempt() {
    setSuccess("");
  }

  function handleBidPlaced(amount: number) {
    setSuccess(
      `Your bid of ${formatCurrency(amount)} was placed successfully.`,
    );
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
        <p className="text-sm text-gray-500">
          Auction #{auction.id.slice(0, 8)}
        </p>
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

        {auction.won ? (
          <div className="mt-4 rounded-lg border border-green-300 bg-green-50 px-4 py-3">
            <DealerAuctionOutcomeBadge
              outcome="RESOLVED"
              won
            />
            <p className="mt-2 text-sm text-green-800">
              Congratulations — your winning bid was accepted for this auction.
            </p>
          </div>
        ) : null}
      </div>

      <div className="mb-6">
        <ImageCarousel
          photos={auction.vehicle.photos}
          title={title}
        />
      </div>

      <VehicleDetails vehicle={auction.vehicle} />

      <section className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">My bids</h2>

        {auction.myBids.length === 0 ? (
          <p className="mb-4 text-sm text-gray-600">
            You haven&apos;t placed a bid on this auction yet.
          </p>
        ) : (
          <ul className="mb-4 space-y-2">
            {auction.myBids.map((bid, index) => (
              <li
                key={bid.id}
                className="flex items-start justify-between gap-3 rounded-lg bg-gray-50 p-3"
              >
                <span className="font-semibold text-gray-900">
                  {formatCurrency(bid.amount)}
                  {index === 0 ? (
                    <span className="ml-2 text-xs font-normal text-gray-400">
                      Latest
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 text-sm text-gray-500">
                  {formatDateTime(bid.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        )}

        {success ? (
          <div
            className="mb-4 rounded bg-green-100 p-3 text-sm text-green-700"
            role="status"
          >
            {success}
          </div>
        ) : null}

        {canBid && auction.minNextBid != null ? (
          <BidForm
            key={`${auction.minNextBid}-${auction.myBids[0]?.amount ?? 0}`}
            auctionId={auction.id}
            minNextBid={auction.minNextBid}
            onBidAttempt={handleBidAttempt}
            onBidPlaced={handleBidPlaced}
          />
        ) : auction.status === "SCHEDULED" ? (
          <p className="text-sm text-gray-600">
            Bidding opens when the auction goes live.
          </p>
        ) : auction.status === "CANCELED" ? (
          <p className="text-sm text-gray-600">
            This auction was canceled and is no longer accepting bids.
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
