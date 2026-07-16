import { formatCurrency } from "@/lib/format";

export type BidFormErrors = {
  amount?: string;
};

export function validateBidForm(
  amount: string,
  minNextBid: number | null,
): BidFormErrors {
  const errors: BidFormErrors = {};

  if (!amount.trim()) {
    errors.amount = "Bid amount is required";
    return errors;
  }

  const parsed = Number(amount);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    errors.amount = "Bid amount must be a positive number";
    return errors;
  }

  if (minNextBid != null && parsed < minNextBid) {
    errors.amount = `Bid must be at least ${formatCurrency(minNextBid)}`;
  }

  return errors;
}

export function hasBidFormErrors(errors: BidFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
