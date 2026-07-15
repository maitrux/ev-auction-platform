import { Injectable } from '@nestjs/common';
import {
  didDealerWinBid,
  getDealerAuctionOutcome,
} from '../auctions/dealer-auction-outcome';
import { getEffectiveAuctionStatus } from '../auctions/auction-status';
import { DealerAuctionOutcome } from '../common/constants/dealer-auction-outcome';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BidsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByDealer(dealerId: string) {
    const bids = await this.prisma.bid.findMany({
      where: {
        dealerId,
      },
      include: {
        auction: {
          include: {
            vehicle: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return bids.map((bid) => {
      const effectiveStatus = getEffectiveAuctionStatus(bid.auction);
      const outcome = getDealerAuctionOutcome(
        effectiveStatus,
        bid.auction.result,
      );

      return {
        id: bid.id,
        amount: bid.amount,
        createdAt: bid.createdAt,
        auction: {
          id: bid.auction.id,
          status: effectiveStatus,
          startsAt: bid.auction.startsAt,
          endsAt: bid.auction.endsAt,
          outcome,
          won:
            outcome === DealerAuctionOutcome.RESOLVED &&
            didDealerWinBid(
              bid.id,
              bid.auction.winningBidId,
              bid.auction.result,
            ),
          vehicle: {
            make: bid.auction.vehicle.make,
            model: bid.auction.vehicle.model,
            year: bid.auction.vehicle.year,
          },
        },
      };
    });
  }
}
