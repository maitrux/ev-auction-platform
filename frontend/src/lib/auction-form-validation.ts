import type { AuctionFormState } from "@/types";

export type AuctionFormErrors = Partial<Record<keyof AuctionFormState, string>>;

function parseRequiredNumber(
  value: string,
  label: string,
): { value?: number; error?: string } {
  const trimmed = value.trim();

  if (!trimmed) {
    return { error: `${label} is required` };
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    return { error: `${label} must be a number` };
  }

  return { value: parsed };
}

export function validateAuctionForm(form: AuctionFormState): AuctionFormErrors {
  const errors: AuctionFormErrors = {};
  const now = new Date();

  if (!form.startsAt) {
    errors.startsAt = "Start date is required";
  } else if (Number.isNaN(new Date(form.startsAt).getTime())) {
    errors.startsAt = "Start date is invalid";
  } else if (new Date(form.startsAt) < now) {
    errors.startsAt = "Start date cannot be in the past";
  }

  if (!form.endsAt) {
    errors.endsAt = "End date is required";
  } else if (Number.isNaN(new Date(form.endsAt).getTime())) {
    errors.endsAt = "End date is invalid";
  } else if (new Date(form.endsAt) < now) {
    errors.endsAt = "End date cannot be in the past";
  }

  if (
    form.startsAt &&
    form.endsAt &&
    !errors.startsAt &&
    !errors.endsAt &&
    new Date(form.endsAt) <= new Date(form.startsAt)
  ) {
    errors.endsAt = "End date must be after start date";
  }

  const reservePrice = parseRequiredNumber(form.reservePrice, "Reserve price");

  if (reservePrice.error) {
    errors.reservePrice = reservePrice.error;
  } else if (reservePrice.value! <= 0) {
    errors.reservePrice = "Reserve price must be greater than 0";
  }

  const minIncrement = parseRequiredNumber(
    form.minIncrement,
    "Minimum increment",
  );

  if (minIncrement.error) {
    errors.minIncrement = minIncrement.error;
  } else if (minIncrement.value! <= 0) {
    errors.minIncrement = "Minimum increment must be greater than 0";
  }

  return errors;
}

export function hasAuctionFormErrors(errors: AuctionFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
