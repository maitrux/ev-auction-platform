import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Vehicle } from '@prisma/client';
import { AuctionOutcome } from 'src/common/constants/auction-outcome';
import { AuctionResult } from 'src/common/constants/auction-result';
import type { AuctionStatus as AuctionStatusType } from 'src/common/constants/auction-status';
import { AuctionStatus } from 'src/common/constants/auction-status';
import type { CreateAuctionWithVehicleInput } from 'src/common/schemas/create-auction-with-vehicle.schema';
import type { UpdateAuctionInput } from 'src/common/schemas/update-auction.schema';
import { throwIfDuplicateVin } from 'src/common/utils/prisma-errors';
import { getMinNextBid } from '../bids/bid-validation';
import { PrismaService } from '../prisma/prisma.service';
import {
  findHighestBid,
  getAcceptOutcomeError,
  getAuctionOutcome,
} from './auction-outcome';
import {
  getEffectiveAuctionStatus,
  getInitialAuctionStatus,
} from './auction-status';
import {
  auctionDetailInclude,
  auctionListInclude,
  dealerAuctionDetailInclude,
  dealerAuctionListInclude,
  type AuctionDetailRecord,
  type AuctionListRecord,
  type DealerAuctionDetailRecord,
  type DealerAuctionListRecord,
} from './auction.types';

type AuctionCreateData = {
  vehicleId: string;
  status: AuctionStatusType;
  startsAt: Date | null;
  endsAt: Date | null;
  reservePrice: number | null;
  minIncrement: number | null;
};

@Injectable()
export class AuctionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const auctions = await this.prisma.auction.findMany({
      include: auctionListInclude,
      orderBy: { createdAt: 'desc' },
    });

    return auctions.map((auction) => this.toListItem(auction));
  }

  async findOpenForDealer() {
    const auctions = await this.prisma.auction.findMany({
      where: {
        status: {
          notIn: [AuctionStatus.DRAFT, AuctionStatus.CANCELLED],
        },
      },
      include: dealerAuctionListInclude,
    });

    return auctions
      .map((auction) => this.toDealerListItem(auction))
      .filter(
        (auction) =>
          auction.status === AuctionStatus.LIVE ||
          auction.status === AuctionStatus.SCHEDULED,
      )
      .sort((a, b) => this.compareDealerAuctions(a, b));
  }

  async findOne(id: string) {
    const auction = await this.prisma.auction.findUnique({
      where: { id },
      include: auctionDetailInclude,
    });

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    return this.toDetail(auction);
  }

  async findOneForDealer(id: string, dealerId: string) {
    const auction = await this.prisma.auction.findUnique({
      where: { id },
      include: dealerAuctionDetailInclude,
    });

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    const effectiveStatus = getEffectiveAuctionStatus(auction);

    if (
      effectiveStatus === AuctionStatus.DRAFT ||
      effectiveStatus === AuctionStatus.CANCELLED
    ) {
      throw new NotFoundException('Auction not found');
    }

    return this.toDealerDetail(auction, dealerId, effectiveStatus);
  }

  async createWithVehicle(input: CreateAuctionWithVehicleInput) {
    const { saveAsDraft, vehicle, auction } = input;

    if (saveAsDraft) {
      const created = await this.createAuctionForVehicle(vehicle, {
        status: AuctionStatus.DRAFT,
        startsAt: auction?.startsAt ?? null,
        endsAt: auction?.endsAt ?? null,
        reservePrice: auction?.reservePrice ?? null,
        minIncrement: auction?.minIncrement ?? null,
      });

      return this.toDetail(created);
    }

    if (
      !auction?.startsAt ||
      !auction.endsAt ||
      auction.reservePrice == null ||
      auction.minIncrement == null
    ) {
      throw new BadRequestException('Auction settings are required');
    }

    const { startsAt, endsAt, reservePrice, minIncrement } = auction;
    const initialStatus = getInitialAuctionStatus(startsAt);

    const created = await this.createAuctionForVehicle(vehicle, {
      status: initialStatus,
      startsAt,
      endsAt,
      reservePrice,
      minIncrement,
    });

    return this.toDetail(created);
  }

  async update(id: string, input: UpdateAuctionInput) {
    const existing = await this.prisma.auction.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Auction not found');
    }

    if (input.status === 'CANCELLED') {
      if (
        existing.status === AuctionStatus.CANCELLED ||
        existing.status === AuctionStatus.ENDED
      ) {
        throw new BadRequestException('Auction cannot be cancelled');
      }

      const updated = await this.prisma.auction.update({
        where: { id },
        data: { status: AuctionStatus.CANCELLED },
        include: auctionDetailInclude,
      });

      return this.toDetail(updated);
    }

    if (input.outcome === 'SOLD' || input.outcome === 'UNSOLD') {
      return this.confirmOutcome(id, input.outcome);
    }

    if (input.publish) {
      if (existing.status !== AuctionStatus.DRAFT) {
        throw new BadRequestException('Only draft auctions can be published');
      }

      const startsAt = input.startsAt ?? existing.startsAt;
      const endsAt = input.endsAt ?? existing.endsAt;
      const reservePrice = input.reservePrice ?? existing.reservePrice;
      const minIncrement = input.minIncrement ?? existing.minIncrement;

      if (
        !startsAt ||
        !endsAt ||
        reservePrice == null ||
        minIncrement == null
      ) {
        throw new BadRequestException(
          'All auction settings are required to publish',
        );
      }

      if (endsAt <= startsAt) {
        throw new BadRequestException('End date must be after start date');
      }

      const updated = await this.prisma.auction.update({
        where: { id },
        data: {
          status: getInitialAuctionStatus(startsAt),
          startsAt,
          endsAt,
          reservePrice,
          minIncrement,
        },
        include: auctionDetailInclude,
      });

      return this.toDetail(updated);
    }

    if (existing.status !== AuctionStatus.DRAFT) {
      throw new BadRequestException('Only draft auctions can be updated');
    }

    const updated = await this.prisma.auction.update({
      where: { id },
      data: {
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        reservePrice: input.reservePrice,
        minIncrement: input.minIncrement,
      },
      include: auctionDetailInclude,
    });

    return this.toDetail(updated);
  }

  private async confirmOutcome(id: string, outcome: 'SOLD' | 'UNSOLD') {
    const auction = await this.prisma.auction.findUnique({
      where: { id },
      include: auctionDetailInclude,
    });

    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    const effectiveStatus = getEffectiveAuctionStatus(auction);

    if (effectiveStatus !== AuctionStatus.ENDED) {
      throw new BadRequestException(
        'Outcome can only be confirmed for ended auctions',
      );
    }

    const currentOutcome = getAuctionOutcome(effectiveStatus, auction.result);

    if (currentOutcome !== AuctionOutcome.PENDING) {
      throw new BadRequestException(
        'Auction outcome has already been confirmed',
      );
    }

    if (outcome === 'SOLD') {
      const acceptError = getAcceptOutcomeError(
        auction.reservePrice,
        auction.bids,
      );

      if (acceptError) {
        throw new BadRequestException(acceptError);
      }

      const highestBid = findHighestBid(auction.bids);

      if (!highestBid) {
        throw new BadRequestException('Cannot accept an auction with no bids');
      }

      const updated = await this.prisma.auction.update({
        where: { id },
        data: {
          status: AuctionStatus.ENDED,
          result: AuctionResult.SOLD,
          winningBidId: highestBid.id,
        },
        include: auctionDetailInclude,
      });

      return this.toDetail(updated);
    }

    const updated = await this.prisma.auction.update({
      where: { id },
      data: {
        status: AuctionStatus.ENDED,
        result: AuctionResult.UNSOLD,
        winningBidId: null,
      },
      include: auctionDetailInclude,
    });

    return this.toDetail(updated);
  }

  private async createAuctionForVehicle(
    vehicle: CreateAuctionWithVehicleInput['vehicle'],
    auctionData: Omit<AuctionCreateData, 'vehicleId'>,
  ): Promise<AuctionDetailRecord> {
    let createdVehicle: Vehicle;

    try {
      createdVehicle = await this.prisma.vehicle.create({
        data: vehicle,
      });
    } catch (error) {
      throwIfDuplicateVin(error);
      throw error;
    }

    try {
      return await this.prisma.auction.create({
        data: {
          vehicleId: createdVehicle.id,
          ...auctionData,
        },
        include: auctionDetailInclude,
      });
    } catch (error) {
      await this.prisma.vehicle.delete({
        where: { id: createdVehicle.id },
      });
      throw error;
    }
  }

  private compareDealerAuctions(
    a: ReturnType<AuctionsService['toDealerListItem']>,
    b: ReturnType<AuctionsService['toDealerListItem']>,
  ) {
    if (a.status !== b.status) {
      return a.status === AuctionStatus.LIVE ? -1 : 1;
    }

    if (a.status === AuctionStatus.LIVE) {
      return (
        new Date(a.endsAt ?? 0).getTime() - new Date(b.endsAt ?? 0).getTime()
      );
    }

    return (
      new Date(a.startsAt ?? 0).getTime() - new Date(b.startsAt ?? 0).getTime()
    );
  }

  private toDealerListItem(auction: DealerAuctionListRecord) {
    return {
      id: auction.id,
      status: getEffectiveAuctionStatus(auction),
      startsAt: auction.startsAt,
      endsAt: auction.endsAt,
      vehicle: auction.vehicle,
    };
  }

  private toDealerDetail(
    auction: DealerAuctionDetailRecord,
    dealerId: string,
    effectiveStatus: AuctionStatusType,
  ) {
    const dealerBids = auction.bids.filter((bid) => bid.dealerId === dealerId);
    const myHighestBid = dealerBids.reduce<(typeof dealerBids)[number] | null>(
      (highest, bid) => {
        if (!highest || bid.amount > highest.amount) {
          return bid;
        }

        return highest;
      },
      null,
    );

    const minNextBid =
      effectiveStatus === AuctionStatus.LIVE
        ? getMinNextBid(auction.bids, auction.minIncrement)
        : null;

    return {
      id: auction.id,
      status: effectiveStatus,
      startsAt: auction.startsAt,
      endsAt: auction.endsAt,
      vehicle: auction.vehicle,
      myBid: myHighestBid
        ? {
            amount: myHighestBid.amount,
            createdAt: myHighestBid.createdAt,
          }
        : null,
      minNextBid,
    };
  }

  private toListItem(auction: AuctionListRecord) {
    const highestBid = auction.bids[0]?.amount ?? null;
    const effectiveStatus = getEffectiveAuctionStatus(auction);

    return {
      id: auction.id,
      status: effectiveStatus,
      startsAt: auction.startsAt,
      endsAt: auction.endsAt,
      bidCount: auction._count.bids,
      highestBid,
      outcome: getAuctionOutcome(effectiveStatus, auction.result),
      vehicle: auction.vehicle,
    };
  }

  private toDetail(auction: AuctionDetailRecord) {
    const highestBid = auction.bids.reduce<number | null>((max, bid) => {
      if (max === null || bid.amount > max) {
        return bid.amount;
      }

      return max;
    }, null);
    const effectiveStatus = getEffectiveAuctionStatus(auction);
    const outcome = getAuctionOutcome(effectiveStatus, auction.result);

    return {
      id: auction.id,
      status: effectiveStatus,
      startsAt: auction.startsAt,
      endsAt: auction.endsAt,
      reservePrice: auction.reservePrice,
      minIncrement: auction.minIncrement,
      bidCount: auction._count.bids,
      highestBid,
      outcome,
      vehicle: auction.vehicle,
      bids: auction.bids.map((bid) => ({
        id: bid.id,
        amount: bid.amount,
        createdAt: bid.createdAt,
        dealer: bid.dealer,
      })),
      winningBid:
        outcome === AuctionOutcome.SOLD && auction.winningBid
          ? {
              amount: auction.winningBid.amount,
              dealer: auction.winningBid.dealer,
            }
          : null,
    };
  }
}
