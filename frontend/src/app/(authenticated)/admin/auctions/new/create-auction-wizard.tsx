"use client";

import {
  hasAuctionFormErrors,
  validateAuctionForm,
  type AuctionFormErrors,
} from "@/lib/auction-form-validation";
import { createAuctionWithVehicleAction } from "@/lib/server/auction-actions";
import {
  hasFormErrors,
  validateVehicleForm,
  type VehicleFormErrors,
} from "@/lib/vehicle-form-validation";
import {
  initialAuctionForm,
  toCreateAuctionWithVehicleInput,
  type AuctionFormState,
  type VehicleFormState,
} from "@/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { VehicleFormFields } from "./vehicle-form-fields";

const initialVehicleForm: VehicleFormState = {
  vin: "",
  make: "",
  model: "",
  year: "",
  mileage: "",
  batteryCapacityKwh: "",
  batterySoH: "",
  rangeKm: "",
  registrationDate: "",
  condition: "GOOD",
  conditionNotes: "",
  photos: "",
  city: "",
  country: "",
};

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

export function CreateAuctionWizard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [vehicleForm, setVehicleForm] =
    useState<VehicleFormState>(initialVehicleForm);
  const [auctionForm, setAuctionForm] =
    useState<AuctionFormState>(initialAuctionForm);
  const [vehicleFieldErrors, setVehicleFieldErrors] =
    useState<VehicleFormErrors>({});
  const [auctionFieldErrors, setAuctionFieldErrors] =
    useState<AuctionFormErrors>({});
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearVehicleFieldError(name: keyof VehicleFormState) {
    setVehicleFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function clearAuctionFieldError(name: keyof AuctionFormState) {
    setAuctionFieldErrors((current) => {
      if (!current[name]) {
        return current;
      }

      const next = { ...current };
      delete next[name];
      return next;
    });
  }

  function handleVehicleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    setVehicleForm((current) => ({
      ...current,
      [name]: value,
    }));
    clearVehicleFieldError(name as keyof VehicleFormState);
    setError("");
  }

  function handleAuctionChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setAuctionForm((current) => ({
      ...current,
      [name]: value,
    }));
    clearAuctionFieldError(name as keyof AuctionFormState);
    setError("");
  }

  async function handleSaveAsDraft() {
    setError("");
    setIsSubmitting(true);

    const validationErrors = validateVehicleForm(vehicleForm);

    if (hasFormErrors(validationErrors)) {
      setVehicleFieldErrors(validationErrors);
      setError("Please fix the highlighted fields.");
      setIsSubmitting(false);
      return;
    }

    setVehicleFieldErrors({});

    const result = await createAuctionWithVehicleAction(
      toCreateAuctionWithVehicleInput(vehicleForm, auctionForm, true),
    );

    setIsSubmitting(false);

    if (!result.success) {
      setVehicleFieldErrors(result.fieldErrors ?? {});
      setError(result.message);
      return;
    }

    router.push(`/admin/auctions/${result.auction.id}`);
    router.refresh();
  }

  function handleNext() {
    setError("");

    const validationErrors = validateVehicleForm(vehicleForm);

    if (hasFormErrors(validationErrors)) {
      setVehicleFieldErrors(validationErrors);
      setError("Please fix the highlighted fields.");
      return;
    }

    setVehicleFieldErrors({});
    setStep(2);
  }

  async function handleCreateAuction() {
    setError("");
    setIsSubmitting(true);

    const validationErrors = validateAuctionForm(auctionForm);

    if (hasAuctionFormErrors(validationErrors)) {
      setAuctionFieldErrors(validationErrors);
      setError("Please fix the highlighted fields.");
      setIsSubmitting(false);
      return;
    }

    setAuctionFieldErrors({});

    const result = await createAuctionWithVehicleAction(
      toCreateAuctionWithVehicleInput(vehicleForm, auctionForm, false),
    );

    setIsSubmitting(false);

    if (!result.success) {
      setVehicleFieldErrors(result.fieldErrors ?? {});
      setError(result.message);
      return;
    }

    router.push(`/admin/auctions/${result.auction.id}`);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/auctions"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to auctions
        </Link>
      </div>

      <h1 className="mb-2 text-2xl font-bold">Create auction</h1>
      <p className="mb-6 text-sm text-gray-600">Step {step} of 2</p>

      {error && (
        <div
          className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}

      {step === 1 ? (
        <section>
          <h2 className="mb-4 text-lg font-semibold">Vehicle information</h2>

          <VehicleFormFields
            form={vehicleForm}
            fieldErrors={vehicleFieldErrors}
            onChange={handleVehicleChange}
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleSaveAsDraft}
              disabled={isSubmitting}
              className="rounded border px-4 py-2 disabled:opacity-50"
            >
              Save as draft
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </section>
      ) : (
        <section>
          <h2 className="mb-4 text-lg font-semibold">Auction details</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="startsAt"
                className="mb-1 block text-sm font-medium"
              >
                Start date/time
              </label>
              <input
                id="startsAt"
                name="startsAt"
                type="datetime-local"
                value={auctionForm.startsAt}
                onChange={handleAuctionChange}
                className={fieldClassName(Boolean(auctionFieldErrors.startsAt))}
                aria-invalid={Boolean(auctionFieldErrors.startsAt)}
              />
              <FieldError
                id="startsAt-error"
                message={auctionFieldErrors.startsAt}
              />
            </div>

            <div>
              <label
                htmlFor="endsAt"
                className="mb-1 block text-sm font-medium"
              >
                End date/time
              </label>
              <input
                id="endsAt"
                name="endsAt"
                type="datetime-local"
                value={auctionForm.endsAt}
                onChange={handleAuctionChange}
                className={fieldClassName(Boolean(auctionFieldErrors.endsAt))}
                aria-invalid={Boolean(auctionFieldErrors.endsAt)}
              />
              <FieldError
                id="endsAt-error"
                message={auctionFieldErrors.endsAt}
              />
            </div>

            <div>
              <label
                htmlFor="reservePrice"
                className="mb-1 block text-sm font-medium"
              >
                Reserve price (€)
              </label>
              <input
                id="reservePrice"
                name="reservePrice"
                type="number"
                value={auctionForm.reservePrice}
                onChange={handleAuctionChange}
                className={fieldClassName(
                  Boolean(auctionFieldErrors.reservePrice),
                )}
                aria-invalid={Boolean(auctionFieldErrors.reservePrice)}
              />
              <FieldError
                id="reservePrice-error"
                message={auctionFieldErrors.reservePrice}
              />
            </div>

            <div>
              <label
                htmlFor="minIncrement"
                className="mb-1 block text-sm font-medium"
              >
                Minimum increment (€)
              </label>
              <input
                id="minIncrement"
                name="minIncrement"
                type="number"
                value={auctionForm.minIncrement}
                onChange={handleAuctionChange}
                className={fieldClassName(
                  Boolean(auctionFieldErrors.minIncrement),
                )}
                aria-invalid={Boolean(auctionFieldErrors.minIncrement)}
              />
              <FieldError
                id="minIncrement-error"
                message={auctionFieldErrors.minIncrement}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={isSubmitting}
              className="rounded border px-4 py-2 disabled:opacity-50"
            >
              ← Back
            </button>

            <button
              type="button"
              onClick={handleCreateAuction}
              disabled={isSubmitting}
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Create auction
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
