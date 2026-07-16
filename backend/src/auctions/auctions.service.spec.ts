import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuctionOutcome } from '../common/constants/auction-outcome';
import { AuctionResult } from '../common/constants/auction-result';
import { AuctionStatus } from '../common/constants/auction-status';
import { PrismaService } from '../prisma/prisma.service';
import { auctionDetailInclude } from './auction.types';
import { AuctionsService } from './auctions.service';

describe('AuctionsService', () => {
  let service: AuctionsService;

  const prisma = {
    auction: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    vehicle: {
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuctionsService,
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    service = module.get<AuctionsService>(AuctionsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOpenForDealer', () => {
    function buildAuction(overrides: Record<string, unknown> = {}) {
      return {
        id: 'auction-1',
        status: AuctionStatus.LIVE,
        startsAt: new Date('2026-07-14T12:00:00.000Z'),
        endsAt: new Date('2026-07-18T12:00:00.000Z'),
        result: null,
        vehicle: {
          make: 'Tesla',
          model: 'Model 3',
          year: 2022,
          photos: [],
          city: 'Munich',
          country: 'Germany',
          mileage: 25000,
        },
        bids: [],
        ...overrides,
      };
    }

    it('returns only LIVE and SCHEDULED auctions', async () => {
      prisma.auction.findMany.mockResolvedValue([
        buildAuction({ id: 'live-1' }),
        buildAuction({
          id: 'scheduled-1',
          status: AuctionStatus.SCHEDULED,
          startsAt: new Date('2026-07-20T12:00:00.000Z'),
          endsAt: new Date('2026-07-23T12:00:00.000Z'),
        }),
        buildAuction({
          id: 'ended-1',
          status: AuctionStatus.ENDED,
          startsAt: new Date('2026-06-01T12:00:00.000Z'),
          endsAt: new Date('2026-06-05T12:00:00.000Z'),
        }),
      ]);

      const result = await service.findOpenForDealer('dealer-1');

      expect(result).toHaveLength(2);
      expect(result.map((auction) => auction.id)).toEqual([
        'live-1',
        'scheduled-1',
      ]);
      expect(result[0].status).toBe(AuctionStatus.LIVE);
      expect(result[1].status).toBe(AuctionStatus.SCHEDULED);
    });

    it('sorts LIVE auctions before SCHEDULED and by soonest end/start', async () => {
      prisma.auction.findMany.mockResolvedValue([
        buildAuction({
          id: 'scheduled-later',
          status: AuctionStatus.SCHEDULED,
          startsAt: new Date('2026-07-25T12:00:00.000Z'),
          endsAt: new Date('2026-07-28T12:00:00.000Z'),
        }),
        buildAuction({
          id: 'live-later',
          endsAt: new Date('2026-07-20T12:00:00.000Z'),
        }),
        buildAuction({
          id: 'live-sooner',
          endsAt: new Date('2026-07-17T12:00:00.000Z'),
        }),
        buildAuction({
          id: 'scheduled-sooner',
          status: AuctionStatus.SCHEDULED,
          startsAt: new Date('2026-07-20T12:00:00.000Z'),
          endsAt: new Date('2026-07-23T12:00:00.000Z'),
        }),
      ]);

      const result = await service.findOpenForDealer('dealer-1');

      expect(result.map((auction) => auction.id)).toEqual([
        'live-sooner',
        'live-later',
        'scheduled-sooner',
        'scheduled-later',
      ]);
    });

    it('includes enriched vehicle fields for dealer cards', async () => {
      prisma.auction.findMany.mockResolvedValue([buildAuction()]);

      const [auction] = await service.findOpenForDealer('dealer-1');

      expect(auction.vehicle).toEqual({
        make: 'Tesla',
        model: 'Model 3',
        year: 2022,
        photos: [],
        city: 'Munich',
        country: 'Germany',
        mileage: 25000,
      });
      expect(auction.myBid).toBeNull();
      expect(auction).not.toHaveProperty('highestBid');
      expect(auction).not.toHaveProperty('bidCount');
    });

    it('includes the dealer highest bid when they have bid on the auction', async () => {
      prisma.auction.findMany.mockResolvedValue([
        buildAuction({
          bids: [{ amount: 27500 }],
        }),
      ]);

      const [auction] = await service.findOpenForDealer('dealer-1');

      expect(auction.myBid).toBe(27500);
    });
  });

  describe('findOneForDealer', () => {
    function buildDealerDetailAuction(overrides: Record<string, unknown> = {}) {
      return {
        id: 'auction-1',
        status: AuctionStatus.LIVE,
        startsAt: new Date('2026-07-14T12:00:00.000Z'),
        endsAt: new Date('2026-07-18T12:00:00.000Z'),
        minIncrement: 250,
        reservePrice: 42000,
        result: null,
        vehicle: {
          id: 'vehicle-1',
          vin: 'VIN123456789012345',
          make: 'Tesla',
          model: 'Model 3',
          year: 2022,
          mileage: 25000,
          batteryCapacityKwh: 75,
          batterySoH: 94,
          rangeKm: 500,
          registrationDate: new Date('2022-01-01'),
          condition: 'GOOD',
          conditionNotes: null,
          photos: [],
          city: 'Munich',
          country: 'Germany',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        bids: [
          {
            id: 'bid-1',
            amount: 27250,
            createdAt: new Date('2026-07-14T11:00:00.000Z'),
            dealerId: 'dealer-1',
          },
          {
            id: 'bid-2',
            amount: 26900,
            createdAt: new Date('2026-07-14T10:00:00.000Z'),
            dealerId: 'dealer-2',
          },
        ],
        ...overrides,
      };
    }

    it('returns dealer-safe auction detail with my bids and minNextBid', async () => {
      const auction = buildDealerDetailAuction();
      prisma.auction.findUnique.mockResolvedValue(auction);

      const result = await service.findOneForDealer('auction-1', 'dealer-1');

      expect(result).toEqual({
        id: 'auction-1',
        status: AuctionStatus.LIVE,
        startsAt: new Date('2026-07-14T12:00:00.000Z'),
        endsAt: new Date('2026-07-18T12:00:00.000Z'),
        vehicle: auction.vehicle,
        myBids: [
          {
            id: 'bid-1',
            amount: 27250,
            createdAt: new Date('2026-07-14T11:00:00.000Z'),
          },
        ],
        minNextBid: 27500,
        outcome: null,
        won: false,
      });
      expect(result).not.toHaveProperty('reservePrice');
      expect(result).not.toHaveProperty('minIncrement');
      expect(result).not.toHaveProperty('highestBid');
      expect(result).not.toHaveProperty('bids');
    });

    it('hides draft auctions from dealers', async () => {
      prisma.auction.findUnique.mockResolvedValue(
        buildDealerDetailAuction({ status: AuctionStatus.DRAFT }),
      );

      await expect(
        service.findOneForDealer('auction-1', 'dealer-1'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('allows dealers to view cancelled auctions', async () => {
      const auction = buildDealerDetailAuction({
        status: AuctionStatus.CANCELLED,
      });
      prisma.auction.findUnique.mockResolvedValue(auction);

      const result = await service.findOneForDealer('auction-1', 'dealer-1');

      expect(result.status).toBe(AuctionStatus.CANCELLED);
      expect(result.minNextBid).toBeNull();
    });
  });

  describe('confirmOutcome via update', () => {
    function buildEndedAuction(overrides: Record<string, unknown> = {}) {
      return {
        id: 'auction-ended',
        status: AuctionStatus.LIVE,
        startsAt: new Date('2026-06-01T12:00:00.000Z'),
        endsAt: new Date('2026-06-05T12:00:00.000Z'),
        reservePrice: 15000,
        minIncrement: 200,
        result: null,
        winningBidId: null,
        winningBid: null,
        vehicle: {
          id: 'vehicle-1',
          vin: 'VIN123',
          make: 'Renault',
          model: 'Zoe',
          year: 2021,
          mileage: 30000,
          batteryCapacityKwh: 52,
          batterySoH: 92,
          rangeKm: 300,
          registrationDate: new Date('2021-01-01'),
          condition: 'GOOD',
          conditionNotes: null,
          photos: [],
          city: 'Paris',
          country: 'France',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        bids: [
          {
            id: 'bid-1',
            amount: 16000,
            createdAt: new Date('2026-07-04T12:00:00.000Z'),
            dealer: { name: 'Dealer A' },
          },
        ],
        _count: { bids: 1 },
        ...overrides,
      };
    }

    it('accepts the highest bid when it meets the reserve', async () => {
      const auction = buildEndedAuction();
      prisma.auction.findUnique.mockResolvedValue(auction);
      prisma.auction.update.mockResolvedValue({
        ...auction,
        status: AuctionStatus.ENDED,
        result: AuctionResult.SOLD,
        winningBidId: 'bid-1',
        winningBid: {
          amount: 16000,
          dealer: { name: 'Dealer A' },
        },
      });

      const result = await service.update('auction-ended', { outcome: 'SOLD' });

      expect(prisma.auction.update).toHaveBeenCalledWith({
        where: { id: 'auction-ended' },
        data: {
          status: AuctionStatus.ENDED,
          result: AuctionResult.SOLD,
          winningBidId: 'bid-1',
        },
        include: auctionDetailInclude,
      });
      expect(result.outcome).toBe(AuctionOutcome.SOLD);
      expect(result.winningBid).toEqual({
        amount: 16000,
        dealer: { name: 'Dealer A' },
      });
    });

    it('rejects accept when the highest bid is below reserve', async () => {
      prisma.auction.findUnique.mockResolvedValue(
        buildEndedAuction({
          reservePrice: 17000,
        }),
      );

      await expect(
        service.update('auction-ended', { outcome: 'SOLD' }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('marks the auction as unsold on reject', async () => {
      const auction = buildEndedAuction();
      prisma.auction.findUnique.mockResolvedValue(auction);
      prisma.auction.update.mockResolvedValue({
        ...auction,
        status: AuctionStatus.ENDED,
        result: AuctionResult.UNSOLD,
        winningBidId: null,
        winningBid: null,
      });

      const result = await service.update('auction-ended', {
        outcome: 'UNSOLD',
      });

      expect(prisma.auction.update).toHaveBeenCalledWith({
        where: { id: 'auction-ended' },
        data: {
          status: AuctionStatus.ENDED,
          result: AuctionResult.UNSOLD,
          winningBidId: null,
        },
        include: auctionDetailInclude,
      });
      expect(result.outcome).toBe(AuctionOutcome.UNSOLD);
      expect(result.winningBid).toBeNull();
    });
  });
});
