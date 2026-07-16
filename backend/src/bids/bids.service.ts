import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuctionStatus } from 'src/common/constants/auction-status';
import { DealerAuctionOutcome } from 'src/common/constants/dealer-auction-outcome';
import type { CreateBidInput } from 'src/common/schemas/create-bid.schema';
import { getEffectiveAuctionStatus } from '../auctions/auction-status';
import {
  didDealerWinBid,
  getDealerAuctionOutcome,
} from '../auctions/dealer-auction-outcome';
import { PrismaService } from '../prisma/prisma.service';
import type { CreatedBid } from './bid.types';
import { getBidAmountError } from './bid-validation';

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

  async create(dealerId: string, input: CreateBidInput): Promise<CreatedBid> {
    const auction = await this.prisma.auction.findUnique({
      where: { id: input.auctionId },
      include: {
        bids: {
          select: {
            amount: true,
            createdAt: true,
          },
        },
      },
    });

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    const effectiveStatus = getEffectiveAuctionStatus(auction);

    if (effectiveStatus !== AuctionStatus.LIVE) {
      throw new BadRequestException('Bids can only be placed on live auctions');
    }

    const amountError = getBidAmountError(
      input.amount,
      auction.bids,
      auction.minIncrement,
    );

    if (amountError) {
      throw new BadRequestException(amountError);
    }

    const bid = await this.prisma.bid.create({
      data: {
        auctionId: input.auctionId,
        dealerId,
        amount: input.amount,
      },
    });

    return {
      id: bid.id,
      amount: bid.amount,
      createdAt: bid.createdAt,
    };
  }
}
