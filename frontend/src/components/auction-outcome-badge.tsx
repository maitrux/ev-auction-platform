import { formatAuctionOutcome } from "@/lib/format";
import type { AuctionOutcome } from "@/types";

function iconClassName() {
  return "h-3.5 w-3.5 shrink-0";
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClassName()}
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClassName()}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={iconClassName()}
      aria-hidden="true"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

const outcomeIcons: Record<
  AuctionOutcome,
  () => React.ReactElement
> = {
  PENDING: ClockIcon,
  SOLD: CheckIcon,
  UNSOLD: XIcon,
};

interface AuctionOutcomeBadgeProps {
  outcome: AuctionOutcome;
}

export function AuctionOutcomeBadge({ outcome }: AuctionOutcomeBadgeProps) {
  const { label, badgeClassName } = formatAuctionOutcome(outcome);
  const Icon = outcomeIcons[outcome];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClassName}`}
    >
      <Icon />
      {label}
    </span>
  );
}
