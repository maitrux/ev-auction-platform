import { AuctionResult } from 'src/common/constants/auction-result';
import { AuctionStatus } from 'src/common/constants/auction-status';

type AuctionForStatus = {
  status: string;
  startsAt: Date | null;
  endsAt: Date | null;
  result: string | null;
};

export function getEffectiveAuctionStatus(
  auction: AuctionForStatus,
  now: Date = new Date(),
): AuctionStatus {
  if (auction.status === AuctionStatus.DRAFT) {
    return AuctionStatus.DRAFT;
  }

  if (auction.status === AuctionStatus.CANCELLED) {
    return AuctionStatus.CANCELLED;
  }

  if (auction.result === AuctionResult.SOLD) {
    return AuctionStatus.ENDED;
  }

  if (!auction.startsAt || !auction.endsAt) {
    return auction.status as AuctionStatus;
  }

  if (now < auction.startsAt) {
    return AuctionStatus.SCHEDULED;
  }

  if (now >= auction.startsAt && now < auction.endsAt) {
    return AuctionStatus.LIVE;
  }

  return AuctionStatus.ENDED;
}

export function getInitialAuctionStatus(
  startsAt: Date,
  now: Date = new Date(),
): AuctionStatus {
  return startsAt <= now ? AuctionStatus.LIVE : AuctionStatus.SCHEDULED;
}

export { AuctionResult, AuctionStatus };
