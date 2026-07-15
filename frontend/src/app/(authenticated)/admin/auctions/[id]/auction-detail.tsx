"use client";

import {
  hasAuctionFormErrors,
  validateAuctionForm,
  type AuctionFormErrors,
} from "@/lib/auction-form-validation";
import {
  formatAuctionStatus,
  formatCurrency,
  formatDateTime,
  formatNumber,
  toDatetimeLocalValue,
} from "@/lib/format";
import {
  cancelAuctionAction,
  publishAuctionAction,
} from "@/lib/server/auction-actions";
import type { AuctionDetail } from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AuctionDetailViewProps {
  auction: AuctionDetail;
}

function fieldClassName(hasError: boolean) {
  return hasError
    ? "w-full rounded border border-red-500 px-3 py-2 focus:border-red-500 focus:outline-none"
    : "w-full rounded border px-3 py-2 focus:border-blue-500 focus:outline-none";
}

export function AuctionDetailView({ auction }: AuctionDetailViewProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPublishForm, setShowPublishForm] = useState(false);
  const [publishForm, setPublishForm] = useState({
    startsAt: auction.startsAt ? toDatetimeLocalValue(auction.startsAt) : "",
    endsAt: auction.endsAt ? toDatetimeLocalValue(auction.endsAt) : "",
    reservePrice:
      auction.reservePrice != null ? String(auction.reservePrice) : "",
    minIncrement:
      auction.minIncrement != null ? String(auction.minIncrement) : "",
  });
  const [publishErrors, setPublishErrors] = useState<AuctionFormErrors>({});

  const status = formatAuctionStatus(auction.status);
  const shortId = auction.id.slice(0, 8);

  async function handleCancel() {
    if (!confirm("Are you sure you want to cancel this auction?")) {
      return;
    }

    setIsSubmitting(true);
    setError("");

    const result = await cancelAuctionAction(auction.id);

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    router.refresh();
  }

  async function handlePublish() {
    setError("");

    const validationErrors = validateAuctionForm(publishForm);

    if (hasAuctionFormErrors(validationErrors)) {
      setPublishErrors(validationErrors);
      setError("Please fix the highlighted fields.");
      return;
    }

    setPublishErrors({});
    setIsSubmitting(true);

    const result = await publishAuctionAction(auction.id, {
      startsAt: publishForm.startsAt,
      endsAt: publishForm.endsAt,
      reservePrice: Number(publishForm.reservePrice),
      minIncrement: Number(publishForm.minIncrement),
    });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setShowPublishForm(false);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <Link
          href="/admin/auctions"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to auctions
        </Link>
      </div>

      {error && (
        <div
          className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="mb-8">
        <p className="text-sm text-gray-500">Auction #{shortId}</p>
        <h1 className="text-2xl font-bold">
          {auction.vehicle.make} {auction.vehicle.model}
        </h1>
        <span
          className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.badgeClassName}`}
        >
          {status.label}
        </span>
      </div>

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
            <dt className="text-gray-500">Battery SoH</dt>
            <dd className="font-medium">{auction.vehicle.batterySoH}%</dd>
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
        </dl>
      </section>

      <section className="mb-8 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Auction details</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Status</dt>
            <dd className="font-medium">{status.label}</dd>
          </div>
          <div>
            <dt className="text-gray-500"></dt>
          </div>
          <div>
            <dt className="text-gray-500">Start</dt>
            <dd className="font-medium">
              {auction.startsAt ? formatDateTime(auction.startsAt) : "-"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">End</dt>
            <dd className="font-medium">
              {auction.endsAt ? formatDateTime(auction.endsAt) : "-"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Reserve price</dt>
            <dd className="font-medium">
              {auction.reservePrice != null
                ? formatCurrency(auction.reservePrice)
                : "-"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500">Minimum increment</dt>
            <dd className="font-medium">
              {auction.minIncrement != null
                ? formatCurrency(auction.minIncrement)
                : "-"}
            </dd>
          </div>
        </dl>

        {auction.status === "DRAFT" && !showPublishForm && (
          <button
            type="button"
            onClick={() => setShowPublishForm(true)}
            disabled={isSubmitting}
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Publish auction
          </button>
        )}

        {showPublishForm && (
          <div className="mt-4 border-t pt-4">
            <h3 className="mb-3 text-sm font-medium">Publish auction</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="publish-startsAt"
                  className="mb-1 block text-sm font-medium"
                >
                  Start date/time
                </label>
                <input
                  id="publish-startsAt"
                  name="startsAt"
                  type="datetime-local"
                  value={publishForm.startsAt}
                  onChange={(event) =>
                    setPublishForm((current) => ({
                      ...current,
                      startsAt: event.target.value,
                    }))
                  }
                  className={fieldClassName(Boolean(publishErrors.startsAt))}
                />
              </div>
              <div>
                <label
                  htmlFor="publish-endsAt"
                  className="mb-1 block text-sm font-medium"
                >
                  End date/time
                </label>
                <input
                  id="publish-endsAt"
                  name="endsAt"
                  type="datetime-local"
                  value={publishForm.endsAt}
                  onChange={(event) =>
                    setPublishForm((current) => ({
                      ...current,
                      endsAt: event.target.value,
                    }))
                  }
                  className={fieldClassName(Boolean(publishErrors.endsAt))}
                />
              </div>
              <div>
                <label
                  htmlFor="publish-reservePrice"
                  className="mb-1 block text-sm font-medium"
                >
                  Reserve price (€)
                </label>
                <input
                  id="publish-reservePrice"
                  name="reservePrice"
                  type="number"
                  value={publishForm.reservePrice}
                  onChange={(event) =>
                    setPublishForm((current) => ({
                      ...current,
                      reservePrice: event.target.value,
                    }))
                  }
                  className={fieldClassName(
                    Boolean(publishErrors.reservePrice),
                  )}
                />
              </div>
              <div>
                <label
                  htmlFor="publish-minIncrement"
                  className="mb-1 block text-sm font-medium"
                >
                  Minimum increment (€)
                </label>
                <input
                  id="publish-minIncrement"
                  name="minIncrement"
                  type="number"
                  value={publishForm.minIncrement}
                  onChange={(event) =>
                    setPublishForm((current) => ({
                      ...current,
                      minIncrement: event.target.value,
                    }))
                  }
                  className={fieldClassName(
                    Boolean(publishErrors.minIncrement),
                  )}
                />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handlePublish}
                disabled={isSubmitting}
                className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Confirm publish
              </button>
              <button
                type="button"
                onClick={() => setShowPublishForm(false)}
                disabled={isSubmitting}
                className="rounded border px-4 py-2 text-sm disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {(auction.status === "SCHEDULED" || auction.status === "LIVE") && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="mt-4 rounded border border-red-300 px-4 py-2 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50"
          >
            Cancel auction
          </button>
        )}
      </section>

      <section className="mb-8 rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Bids</h2>

        {auction.bids.length === 0 ? (
          <p className="text-sm text-gray-600">No bids yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b">
                <tr>
                  <th className="px-2 py-2">Dealer</th>
                  <th className="px-2 py-2">Bid</th>
                  <th className="px-2 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {auction.bids.map((bid) => (
                  <tr
                    key={bid.id}
                    className="border-b"
                  >
                    <td className="px-2 py-2">{bid.dealer.name}</td>
                    <td className="px-2 py-2">{formatCurrency(bid.amount)}</td>
                    <td className="px-2 py-2">
                      {formatDateTime(bid.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">Result</h2>

        {auction.status === "ENDED" && auction.winningBid ? (
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">Winner</dt>
              <dd className="font-medium">{auction.winningBid.dealer.name}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Winning bid</dt>
              <dd className="font-medium">
                {formatCurrency(auction.winningBid.amount)}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Seller payout</dt>
              <dd className="font-medium">Pending</dd>
            </div>
          </dl>
        ) : auction.status === "ENDED" && auction.result === "UNSOLD" ? (
          <p className="text-sm text-gray-600">Ended — unsold</p>
        ) : (
          <p className="text-sm text-gray-600">No result yet.</p>
        )}
      </section>
    </div>
  );
}
