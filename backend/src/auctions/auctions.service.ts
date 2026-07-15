import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuctionResult } from 'src/common/constants/auction-result';
import { AuctionStatus } from 'src/common/constants/auction-status';
import type { AuctionStatus as AuctionStatusType } from 'src/common/constants/auction-status';
import type { CreateAuctionWithVehicleInput } from 'src/common/schemas/create-auction-with-vehicle.schema';
import type { UpdateAuctionInput } from 'src/common/schemas/update-auction.schema';
import { PrismaService } from '../prisma/prisma.service';
import {
  getEffectiveAuctionStatus,
  getInitialAuctionStatus,
} from './auction-status';
import {
  auctionDetailInclude,
  auctionListInclude,
  type AuctionDetailRecord,
  type AuctionListRecord,
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
        existing.status === AuctionStatus.COMPLETED
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

  private async createAuctionForVehicle(
    vehicle: CreateAuctionWithVehicleInput['vehicle'],
    auctionData: Omit<AuctionCreateData, 'vehicleId'>,
  ): Promise<AuctionDetailRecord> {
    const createdVehicle = await this.prisma.vehicle.create({
      data: vehicle,
    });

    try {
      return (await this.prisma.auction.create({
        data: {
          vehicleId: createdVehicle.id,
          ...auctionData,
        },
        include: auctionDetailInclude,
      })) as AuctionDetailRecord;
    } catch (error) {
      await this.prisma.vehicle.delete({
        where: { id: createdVehicle.id },
      });
      throw error;
    }
  }

  private toListItem(auction: AuctionListRecord) {
    const highestBid = auction.bids[0]?.amount ?? null;

    return {
      id: auction.id,
      status: getEffectiveAuctionStatus(auction),
      startsAt: auction.startsAt,
      endsAt: auction.endsAt,
      bidCount: auction._count.bids,
      highestBid,
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

    return {
      id: auction.id,
      status: getEffectiveAuctionStatus(auction),
      startsAt: auction.startsAt,
      endsAt: auction.endsAt,
      reservePrice: auction.reservePrice,
      minIncrement: auction.minIncrement,
      bidCount: auction._count.bids,
      highestBid,
      result: this.toAuctionResult(auction.result),
      vehicle: auction.vehicle,
      bids: auction.bids.map((bid) => ({
        id: bid.id,
        amount: bid.amount,
        createdAt: bid.createdAt,
        dealer: bid.dealer,
      })),
      winningBid: auction.winningBid
        ? {
            amount: auction.winningBid.amount,
            dealer: auction.winningBid.dealer,
          }
        : null,
    };
  }

  private toAuctionResult(result: string | null): AuctionResult | null {
    if (result === AuctionResult.SOLD || result === AuctionResult.UNSOLD) {
      return result;
    }

    return null;
  }
}
